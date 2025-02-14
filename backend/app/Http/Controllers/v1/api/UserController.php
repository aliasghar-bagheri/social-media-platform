<?php

namespace App\Http\Controllers\v1\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;

use function PHPUnit\Framework\isNull;

class UserController extends Controller
{
    public $token;

    public function register(Request $request)
    {
        $response["response"] = [
            "success" => false,
            "message" => "you've proble please call with app suported.",
            "code" => 400,
        ];

        $validate = Validator::make($request->all(), [
            'name' => 'required|string',
            'phone' => 'nullable|unique:users',
            'username' => 'required|unique:users',
            'password' => 'required',
            'bio' => 'nullable',
            'email' => 'required|unique:users',
            'profile' => 'nullable',
        ]);
        if ($validate->fails()) {
            return response()->json([
                'status' => '401',
                'messages' => $validate->errors(),
            ], 401);
        }
        $user_id = Str::uuid();
        $user = User::create([
            'id' => $user_id,
            'phone' => $request->phone,
            'username' => $request->username,
            'name' => $request->name,
            'bio' => $request->bio,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);
        if (isset($request->profile)) {
            $file = $request->profile;
            $path = "images/customer$user_id/";
            $name = $request->username . "." . $file->extension();
            Storage::putFileAs($path, $file, $name);
            User::whereId($user_id)->update(['profile' => $path . $name]);
        }

        $user->profile = env('APP_URL') . "/$user->profile";

        $accessToken = $user->createToken('auth_token')->plainTextToken;

        $refreshToken = $user->createToken('refresh_token')->plainTextToken;
        $this->token = $user_id;

        $domain = "localhost";
        $accessTokenCookie = cookie('access_token', $accessToken, 10080, '/', $domain, false, true, false, 'Lax'); // 7 days expiry
        $refreshTokenCookie = cookie('refresh_token', $refreshToken, 60 * 24 * 30, '/', $domain, false, true, false, 'Lax'); // 30 days expiry


        return response()->json([
            'status' => 201,
            'message' => 'Register successful',
            'user' => $user,
        ], 201)->withCookie($accessTokenCookie)->withCookie($refreshTokenCookie);
        return json_encode($response, JSON_UNESCAPED_UNICODE);
    }

    public function list(Request $request)
    {
        $accessToken = request()->cookie('access_token');

        if ($accessToken) {
            $accessTokenModel = PersonalAccessToken::findToken($accessToken);
            if ($accessTokenModel) {
                $userId = $accessTokenModel->tokenable_id;
            }

            if (DB::table('users')->whereId($userId)->exists() == true) {
                $users = User::where('name', "LIKE", "%$request->search%")
                    ->orWhere('username', "LIKE", "%$request->search%")->get(['id', 'name', 'phone', 'username', 'email', 'bio', 'profile', 'created_at', 'updated_at']);
                foreach ($users as $item) {
                    $item->profile = env('APP_URL') . "/$item->profile";
                }
                return response()->json([
                    'status' => 200,
                    'users' => $users,
                ], 200);
            } else {

                $response["response"] = [
                    "success" => false,
                    "message" => "you've proble please call with app suported.",
                    "code" => 400,
                ];
            }
        } else {
            return response()->json([
                "status" => 401,
                "message" => "please login to your account",
            ], 401);
        }
    }

    public function profile(Request $request)
    {
        $accessToken = $request->cookie('access_token');
        if ($accessToken) {
            $accessTokenModel = PersonalAccessToken::findToken($accessToken);
            if ($accessTokenModel) {
                $userId = $accessTokenModel->tokenable_id;
            }
            $user = DB::table('users')->whereId($userId);
            if ($user->exists()) {
                $my_profile = $user->first(['id', 'name', 'phone', 'username', 'email', 'bio', 'profile', 'created_at', 'updated_at']);
                $my_profile->profile = env('APP_URL') . "/$my_profile->profile";

                $saved_post = DB::table('save')
                    ->join('posts', 'save.post_id', 'posts.id')
                    ->where('save.user_id', $userId)
                    ->select([
                        'posts.id',
                        'posts.caption',
                        'posts.location',
                        'posts.created_at',
                        'posts.updated_at',
                    ])
                    ->get();
                foreach ($saved_post as $item_saved_post) {
                    $item_saved_post->post_media = DB::table('post_image')->where('post_id', $item_saved_post->id)->get('url');
                    foreach ($item_saved_post->post_media as $image_url) {
                        $image_url->url = env('APP_URL') . "/$image_url->url";
                    }
                }


                $my_posts = DB::table('posts')
                    ->join('users', 'posts.user_id', 'users.id')
                    ->where('posts.user_id', $userId)
                    ->select([
                        'posts.id',
                        'posts.caption',
                        'posts.location',
                        'posts.created_at',
                        'posts.updated_at',
                    ]);
                if ($request->has('search')) {
                    $my_posts = $my_posts->where(function ($query) use ($request) {
                        $query->where('posts.caption', "LIKE", "%{$request->search}%")
                            ->orWhere('posts.location', "LIKE", "%{$request->search}%");
                    });
                }
                $my_posts = $my_posts->get();
                foreach ($my_posts as $item) {


                    $author = DB::table('users')
                        ->join('posts', 'users.id', 'posts.user_id')
                        ->select(['users.id', 'users.name', 'users.email', 'users.username', 'users.profile'])
                        ->where('posts.id', $item->id)
                        ->first();
                    $author->profile = env('APP_URL') . "/$author->profile";
                    $item->author = $author;

                    $item->tags = DB::table('post_tag')
                        ->join('tags', 'post_tag.tag_id', 'tags.id')
                        ->where('post_tag.post_id', $item->id)
                        ->select([
                            'tags.id',
                            'tags.tag',
                        ])
                        ->get();



                    $likesCount = DB::table('post_like')
                        ->where('post_like.post_id', $item->id)
                        ->count();

                    $item->post_likes = DB::table('post_like')
                        ->join('users', 'post_like.user_id', 'users.id')
                        ->where('post_like.post_id', $item->id)
                        ->select([
                            'users.name',
                            'users.profile'
                        ])
                        ->get();
                    foreach ($item->post_likes as $profile_user_like) {
                        $profile_user_like->profile = env('APP_URL') . "/$profile_user_like->profile";
                    }
                    $item->likes_count = $likesCount;
                    $item->is_like = DB::table('post_like')->where('post_id', $item->id)->where('user_id', $userId)->exists();



                    $item->is_save = DB::table('save')->where('post_id', $item->id)->where('user_id', $userId)->exists();

                    $item->post_image = DB::table('post_image')->where('post_id', $item->id)->get();
                    foreach ($item->post_image as $image_url) {
                        $image_url->url = env('APP_URL') . "/$image_url->url";
                    }
                    $item->comment_count = DB::table('comments')->where('post_id', $item->id)->count();
                    $item->comment = DB::table('comments')
                        ->where('post_id', $item->id)
                        ->get();
                    foreach ($item->comment as $comment_item) {

                        $comment_author = DB::table('users')
                            ->join('comments', 'users.id', 'comments.user_id')
                            ->select(['users.id', 'users.name', 'users.email', 'users.username', 'users.profile'])
                            ->where('comments.id', $comment_item->id)
                            ->first();
                        $comment_author->profile = env('APP_URL') . "/$comment_author->profile";
                        $comment_item->comment_author = $comment_author;



                        $comment_item->reply_comment = DB::table('comment_reply')
                            ->where('comment_id', $comment_item->id)
                            ->get()
                            ->map(function ($item_reply_comment) {
                                $reply_comment_author = DB::table('users')
                                    ->where('id', $item_reply_comment->user_id)
                                    ->first(['id', 'name', 'email', 'username', 'profile']);

                                if ($reply_comment_author) {
                                    $reply_comment_author->profile = env('APP_URL') . "/$reply_comment_author->profile";
                                }


                                $item_reply_comment->comment_author = $reply_comment_author;

                                return $item_reply_comment;
                            });
                    }
                }

                return response()->json([
                    'status' => 200,
                    'user' => $my_profile,
                    'saved_post' => $saved_post,
                    'my_posts' => $my_posts,
                ], 200);
            }
        } elseif ($accessToken == null) {
            return response()->json([
                "status" => 401,
                "message" => "please login to your account",
            ], 401);
        }
    }



    public function user_profile(Request $request, $id)
    {
        $accessToken = $request->cookie('access_token');
        if ($accessToken) {
            $accessTokenModel = PersonalAccessToken::findToken($accessToken);
            if ($accessTokenModel) {
                $userId = $accessTokenModel->tokenable_id;
            }
            $user = DB::table('users')->whereId($id);
            if ($user->exists()) {
                $user_profile = $user->first(['id', 'name','username', 'email', 'bio', 'profile']);
                $user_profile->profile = env('APP_URL') . "/$user_profile->profile";



                $user_posts = DB::table('posts')
                    ->join('users', 'posts.user_id', 'users.id')
                    ->where('posts.user_id', $id)
                    ->select([
                        'posts.id',
                        'posts.caption',
                        'posts.location',
                        'posts.created_at',
                        'posts.updated_at',
                    ]);
                if ($request->has('search')) {
                    $user_posts = $user_posts->where(function ($query) use ($request) {
                        $query->where('posts.caption', "LIKE", "%{$request->search}%")
                            ->orWhere('posts.location', "LIKE", "%{$request->search}%");
                    });
                }
                $user_posts = $user_posts->get();
                foreach ($user_posts as $item) {


                    $author = DB::table('users')
                        ->join('posts', 'users.id', 'posts.user_id')
                        ->select(['users.id', 'users.name', 'users.email', 'users.username', 'users.profile'])
                        ->where('posts.id', $item->id)
                        ->first();
                    $author->profile = env('APP_URL') . "/$author->profile";
                    $item->author = $author;

                    $item->tags = DB::table('post_tag')
                        ->join('tags', 'post_tag.tag_id', 'tags.id')
                        ->where('post_tag.post_id', $item->id)
                        ->select([
                            'tags.id',
                            'tags.tag',
                        ])
                        ->get();



                    $likesCount = DB::table('post_like')
                        ->where('post_like.post_id', $item->id)
                        ->count();

                    $item->post_likes = DB::table('post_like')
                        ->join('users', 'post_like.user_id', 'users.id')
                        ->where('post_like.post_id', $item->id)
                        ->select([
                            'users.name',
                            'users.profile'
                        ])
                        ->get();
                    foreach ($item->post_likes as $profile_user_like) {
                        $profile_user_like->profile = env('APP_URL') . "/$profile_user_like->profile";
                    }
                    $item->likes_count = $likesCount;
                    $item->is_like = DB::table('post_like')->where('post_id', $item->id)->where('user_id', $userId)->exists();



                    $item->is_save = DB::table('save')->where('post_id', $item->id)->where('user_id', $userId)->exists();

                    $item->post_image = DB::table('post_image')->where('post_id', $item->id)->get();
                    foreach ($item->post_image as $image_url) {
                        $image_url->url = env('APP_URL') . "/$image_url->url";
                    }
                    $item->comment_count = DB::table('comments')->where('post_id', $item->id)->count();
                    $item->comment = DB::table('comments')
                        ->where('post_id', $item->id)
                        ->get();
                    foreach ($item->comment as $comment_item) {

                        $comment_author = DB::table('users')
                            ->join('comments', 'users.id', 'comments.user_id')
                            ->select(['users.id', 'users.name', 'users.email', 'users.username', 'users.profile'])
                            ->where('comments.id', $comment_item->id)
                            ->first();
                        $comment_author->profile = env('APP_URL') . "/$comment_author->profile";
                        $comment_item->comment_author = $comment_author;



                        $comment_item->reply_comment = DB::table('comment_reply')
                            ->where('comment_id', $comment_item->id)
                            ->get()
                            ->map(function ($item_reply_comment) {
                                $reply_comment_author = DB::table('users')
                                    ->where('id', $item_reply_comment->user_id)
                                    ->first(['id', 'name', 'email', 'username', 'profile']);

                                if ($reply_comment_author) {
                                    $reply_comment_author->profile = env('APP_URL') . "/$reply_comment_author->profile";
                                }


                                $item_reply_comment->comment_author = $reply_comment_author;

                                return $item_reply_comment;
                            });
                    }
                }

                return response()->json([
                    'status' => 200,
                    'user_profile' => $user_profile,
                    'user_posts' => $user_posts,
                ], 200);
            }
        } elseif ($accessToken == null) {
            return response()->json([
                "status" => 401,
                "message" => "please login to your account",
            ], 401);
        }
    }

    public function login(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'password' => 'required',
        ]);
        if ($validate->fails()) {
            return response()->json([
                'status' => 401,
                'messages' => $validate->errors(),
            ], 401);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                "status" => 401,
                'message' => 'Invalid login credentials'
            ], 401);
        }

        $accessToken = $user->createToken('auth_token')->plainTextToken;
        $refreshToken = $user->createToken('refresh_token')->plainTextToken;


        $accessTokenCookie = cookie('access_token', $accessToken, 10080, '/', 'localhost', false, true, false, 'Lax');
        $refreshTokenCookie = cookie('refresh_token', $refreshToken, 60 * 24 * 30, '/', 'localhost', false, true, false, 'Lax');
        $login_data = User::where('email', $request->email)->first(['id', 'name', 'phone', 'username', 'email', 'bio', 'profile', 'created_at', 'updated_at']);
        $login_data->profile = env('APP_URL') . "/$login_data->profile";
        return response()->json([
            'user' => $login_data,
            'status' => 200,
            'message' => 'Login successful',
        ], 200)->withCookie($accessTokenCookie)->withCookie($refreshTokenCookie);
    }

    public function logout()
    {
        $accessToken = request()->cookie('access_token');

        if ($accessToken) {
            $accessTokenModel = PersonalAccessToken::findToken($accessToken);
            if ($accessTokenModel) {
                $userId = $accessTokenModel->tokenable_id;
            }
        }

        $accessTokenCookie = Cookie::make('access_token', '', -1, '/', 'localhost', false, true, false, 'Lax');
        $refreshTokenCookie = Cookie::make('refresh_token', '', -1, '/', 'localhost', false, true, false, 'Lax');


        return response()->json([
            'status' => 201,
            'message' => 'Logout successful'
        ], 201)->withCookie($accessTokenCookie)->withCookie($refreshTokenCookie);
    }



    public function update(Request $request)
    {
        $accessToken = request()->cookie('access_token');
        if ($accessToken) {
            $accessTokenModel = PersonalAccessToken::findToken($accessToken);
            if ($accessTokenModel) {
                $userId = $accessTokenModel->tokenable_id;
            }
            if (DB::table('users')->whereId($userId)->exists()) {
                $validate = Validator::make($request->all(), [
                    'name' => 'nullable',
                    'phone' => 'nullable',
                    'username' => 'nullable',
                    'bio' => 'nullable',
                    'email' => 'nullable',
                    'profile' => 'nullable',
                ]);
                if ($validate->fails()) {
                    return response()->json([
                        'status' => 401,
                        'message' => $validate->errors()
                    ], 401);
                }
                $info = DB::table('users')->whereId($userId)->first();
                DB::table('users')->whereId($userId)->update([
                    'name' => $request->name ?? $info->name,
                    'phone' => $request->phone ?? $info->phone,
                    'username' => $request->username ?? $info->username,
                    'bio' => $request->bio ?? $info->bio,
                    'email' => $request->email ?? $info->email,
                ]);

                if (file_exists($request->profile)) {
                    $profile = DB::table('users')->whereId($userId)->first('profile');
                    if ($profile->profile != null) {
                        unlink($profile->profile);
                    }

                    $file = $request->profile;
                    $path = "images/customer$userId/";
                    $name = "profile" . "." . $file->extension();
                    Storage::putFileAs($path, $file, $name);
                    User::whereId($userId)->update(['profile' => $path . $name]);
                }

                $info = DB::table('users')->whereId($userId)->first(['name', 'phone', 'username', 'bio', 'email', 'profile']);
                $info->profile = env('APP_URL') . "/$info->profile";
                return response()->json([
                    'status' => 201,
                    'message' => "success",
                    "data" => $info,
                ], 201);
            } else {
                return response()->json([
                    "status" => 401,
                    "message" => "The desired user was not found",
                ], 401);
            }
        } else {
            return response()->json([
                "status" => 401,
                "message" => "please login to your account",
            ], 401);
        }
    }


    public function update_password(Request $request)
    {
        $accessToken = request()->cookie('access_token');
        if ($accessToken) {
            $accessTokenModel = PersonalAccessToken::findToken($accessToken);
            if ($accessTokenModel) {
                $userId = $accessTokenModel->tokenable_id;
            }
            if (DB::table('users')->whereId($userId)->exists()) {

                $validate = Validator::make($request->all(), [
                    'current_password' => 'required|string',
                    'new_password' => 'required|confirmed',
                ]);

                if ($validate->fails()) {
                    return response()->json([
                        'status' => 422,
                        'message' => $validate->errors(),
                    ], 422);
                }
                $user = DB::table('users')->whereId($userId)->first();
                if (!Hash::check($request->current_password, $user->password)) {
                    return response()->json([
                        'status' => 422,
                        'message' => "The current password is not correct",
                    ], 422);
                } else {
                    DB::table('users')->whereId($userId)->update([
                        'password' => Hash::make($request->new_password),
                    ]);
                }

                return response()->json([
                    'status' => 201,
                    'message' => "password changed successfully",
                ], 201);
            }
        } else {
            return response()->json([
                "status" => 401,
                "message" => "please login to your account",
            ], 401);
        }
    }
}
