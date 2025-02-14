<?php

namespace App\Http\Controllers\v1\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Laravel\Sanctum\PersonalAccessToken;

class PostController extends Controller
{
    public function list(Request $request)
    {
        $accessToken = request()->cookie('access_token');

        if ($accessToken) {
            $accessTokenModel = PersonalAccessToken::findToken($accessToken);
            if ($accessTokenModel) {
                $userId = $accessTokenModel->tokenable_id;
            }
            $all_post = DB::table('posts')
                ->join('users', 'posts.user_id', 'users.id')
                ->select([
                    'posts.id',
                    'posts.caption',
                    'posts.location',
                    'posts.created_at',
                    'posts.updated_at',
                ]);
            if ($request->has('search')) {
                $all_post = $all_post->where(function ($query) use ($request) {
                    $query->where('posts.caption', "LIKE", "%{$request->search}%")
                        ->orWhere('posts.location', "LIKE", "%{$request->search}%");
                });
            }
            $paginatedPosts = $all_post->paginate(15);

            foreach ($paginatedPosts->items() as $item) {


                $author = DB::table('users')
                    ->join('posts', 'users.id', 'posts.user_id')
                    ->select(['users.id', 'users.name', 'users.email', 'users.username', 'users.profile'])
                    ->where('posts.id', $item->id)
                    ->first();
                $author->profile = env('APP_URL') . "/$author->profile";
                $item->author = $author;
                // foreach ($item->author as $item_author) {

                // }
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


                $item->save = DB::table('save')
                    ->join('users', 'save.user_id', 'users.id')
                    ->where('save.post_id', $item->id)
                    ->select([
                        'users.name',
                        'users.profile',
                    ])->where('save.post_id', $item->id)->get();

                $item->is_save = DB::table('save')->where('post_id', $item->id)->where('user_id', $userId)->exists();
                $item->save_count = DB::table('save')->where('post_id', $item->id)->count();


                $item->post_image = DB::table('post_image')->where('post_id', $item->id)->get();
                foreach ($item->save as $profile_user_save) {
                    $profile_user_save->profile = env('APP_URL') . "/$profile_user_save->profile";
                }

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
                'count' => $paginatedPosts->total(),
                'next' => $paginatedPosts->nextPageUrl(),
                'previous' => $paginatedPosts->previousPageUrl(),
                "data" => $paginatedPosts->items(),
            ], 200);
        } else {
            return response()->json([
                "status" => 401,
                "message" => "please login to your account",
            ], 401);
        }
    }


    public function store(Request $request)
    {

        $accessToken = request()->cookie('access_token');

        if ($accessToken) {
            $accessTokenModel = PersonalAccessToken::findToken($accessToken);
            if ($accessTokenModel) {
                $userId = $accessTokenModel->tokenable_id;
            }
            $validate = Validator::make($request->all(), [
                'caption' => 'required',
                'location' => 'nullable',
                'image_post.*' => 'required|file|mimes:jpg,png,jpeg,svg,mp4',
                "tag_name" => "nullable|array",
            ]);

            if ($validate->fails()) {
                return response()->json([
                    'status' => 401,
                    "messages" => $validate->errors(),
                ], 401);
            }
            $post_id = Str::uuid();
            DB::table('posts')->insert([
                'id' => $post_id,
                'user_id' => $userId,
                'caption' => $request->caption,
                'location' => $request->location,
            ]);
            if (isset($request->image_post)) {
                for ($i = 0; $i < sizeof($request->image_post); $i++) {
                    $path = "media_post/users/$userId/posts/$post_id";
                    $file = $request->image_post[$i];
                    $random_name = rand(100, 9999);
                    $name = $random_name . "." . $file->extension();
                    Storage::putFileAs($path, $file, $name);
                    DB::table('post_image')->insert([
                        'id' => Str::uuid(),
                        'post_id' => $post_id,
                        'url' => "$path/$name",
                    ]);
                }
            }

            if (isset($request->tag_name)) {
                for ($j = 0; sizeof($request->tag_name) > $j; $j++) {
                    $get_tag_name = DB::table('tags')->where('tag', $request->tag_name[$j])->first();
                    if ($get_tag_name) {
                        DB::table('post_tag')->insert([
                            'post_id' => $post_id,
                            'tag_id' => $get_tag_name->id,
                        ]);
                    } else {
                        $tag_id = Str::uuid();
                        DB::table('tags')->insert([
                            'id' => $tag_id,
                            'tag' => $request->tag_name[$j],
                        ]);
                        DB::table('post_tag')->insert([
                            'post_id' => $post_id,
                            'tag_id' => $tag_id,
                        ]);
                    }
                }
            }
            $data = DB::table('posts')
                ->join('users', 'posts.user_id', 'users.id')
                ->where('posts.user_id', $userId)
                ->where('posts.id', $post_id)
                ->select([
                    'posts.id',
                    'posts.caption',
                    'posts.location',
                    'posts.created_at',
                    'posts.updated_at',
                ])
                ->groupBy('posts.id')
                ->get();

            foreach ($data as $item) {
                $item->post_tag = DB::table('post_tag')
                    ->join('tags', 'post_tag.tag_id', 'tags.id')
                    ->where('post_tag.post_id', $item->id)->get(["tags.tag", "tags.id"]);

                $item->images_post = DB::table('post_image')->where('post_id', $item->id)->get(["url"]);

                foreach ($item->images_post as $image_url) {
                    $image_url->url = env('APP_URL') . "/$image_url->url";
                }
            }

            return response()->json([
                'status' => 201,
                'message' => "Post successfully created",
                "data" => $data,
            ], 201);
        } else {
            return response()->json([
                "status" => 401,
                "message" => "please login to your account",
            ], 401);
        }
    }



    public function update(Request $request)
    {

        $accessToken = request()->cookie('access_token');

        if ($accessToken) {
            $accessTokenModel = PersonalAccessToken::findToken($accessToken);
            if ($accessTokenModel) {
                $userId = $accessTokenModel->tokenable_id;
            }

            $validate = Validator::make($request->all(), [
                'post_id' => 'required|exists:posts,id',
                'caption' => 'required',
                'location' => 'nullable',
                'image_post' => 'nullable|array|min:1',
                'image_post.*' => 'nullable|file|mimes:jpg,png,jpeg,svg,mp4',
                'tag_name' => 'nullable|array',
            ]);

            if ($validate->fails()) {
                return response()->json([
                    'status' => 401,
                    "messages" => $validate->errors(),
                ], 401);
            }
            $old_data = DB::table('posts')->whereId($request->post_id)->first();
            DB::table('posts')->whereId($request->post_id)->update([
                'caption' => $request->caption ?? $old_data->caption,
                'location' => $request->location ?? $old_data->location,
            ]);

            // save images for post
            if (isset($request->image_post)) {

                $check_image_post = DB::table('post_image')->where('post_id', $request->post_id)->exists();
                if ($check_image_post) {
                    $get_image_post_for_delete = DB::table('post_image')->where('post_id', $request->post_id)->get();
                    foreach ($get_image_post_for_delete as $item) {
                        if ($item->url) {
                            unlink($item->url);
                        }

                        DB::table('post_image')->whereId($item->id)->delete();
                    }
                }
                for ($i = 0; $i < sizeof($request->image_post); $i++) {
                    $path = "media_post/users/$userId/posts/$request->post_id";
                    $file = $request->image_post[$i];
                    $random_name = rand(100, 9999);
                    $name = $random_name . "." . $file->extension();
                    Storage::putFileAs($path, $file, $name);
                    DB::table('post_image')->insert([
                        'id' => Str::uuid(),
                        'post_id' => $request->post_id,
                        'url' => "$path/$name",
                    ]);
                }
            }

            // add tags to post
            if (isset($request->tag_name)) {
                for ($j = 0; sizeof($request->tag_name) > $j; $j++) {
                    $get_tag_name = DB::table('tags')->where('tag', $request->tag_name[$j])->first();
                    if ($get_tag_name) {
                        DB::table('post_tag')->insert([
                            'post_id' => $request->post_id,
                            'tag_id' => $get_tag_name->id,
                        ]);
                    } else {
                        $tag_id = Str::uuid();
                        DB::table('tags')->insert([
                            'id' => $tag_id,
                            'tag' => $request->tag_name[$j],
                        ]);
                        DB::table('post_tag')->insert([
                            'post_id' => $request->post_id,
                            'tag_id' => $tag_id,
                        ]);
                    }
                }
            }

            // get information post
            $data = DB::table('posts')
                ->join('users', 'posts.user_id', 'users.id')
                ->where('posts.user_id', $userId)
                ->where('posts.id', $request->post_id)
                ->select([
                    'posts.id',
                    'posts.caption',
                    'posts.location',
                    'posts.created_at',
                    'posts.updated_at',
                ])
                ->groupBy('posts.id')
                ->get();

            foreach ($data as $item) {
                $item->post_tag = DB::table('post_tag')
                    ->join('tags', 'post_tag.tag_id', 'tags.id')
                    ->where('post_tag.post_id', $item->id)->get(["tags.tag", "tags.id"]);

                $item->images_post = DB::table('post_image')->where('post_id', $item->id)->get(["url"]);

                foreach ($item->images_post as $image_url) {
                    $image_url->url = env('APP_URL') . "/$image_url->url";
                }
            }

            return response()->json([
                'status' => 200,
                'message' => "Post successfully created",
                "data" => $data,
            ], 200);
        } else {
            return response()->json([
                "status" => 401,
                "message" => "please login to your account",
            ], 401);
        }
    }


    public function delete(Request $request)
    {
        $accessToken = request()->cookie('access_token');

        if ($accessToken) {
            $accessTokenModel = PersonalAccessToken::findToken($accessToken);
            if ($accessTokenModel) {
                $userId = $accessTokenModel->tokenable_id;
            }

            $validate = Validator::make($request->all(), [
                'post_id' => 'required|exists:posts,id',
            ]);
            if ($validate->fails()) {
                return response()->json([
                    'status' => 401,
                    'message' => $validate->errors(),
                ], 401);
            }

            $delete_post = DB::table('posts')->whereId($request->post_id)->delete();
            $get_post_image = DB::table('post_image')->where('post_id', $request->post_id)->get();
            foreach ($get_post_image as $delete_post_image) {
                if ($delete_post_image) {
                    Storage::delete($delete_post_image->url);
                }
                $delete_post_image = DB::table('post_image')->where('id', $delete_post_image->id)->delete();
            }

            $delete_post_like = DB::table('post_like')->where('post_id', $request->post_id)->delete();
            $delete_post_tag = DB::table('post_tag')->where('post_id', $request->post_id)->delete();
            $delete_post_save = DB::table('save')->where('post_id', $request->post_id)->delete();
            $get_post_comment = DB::table('comments')->where('post_id', $request->post_id)->get();
            foreach ($get_post_comment as $item) {
                DB::table('comment_reply')->where('comment_id', $item->comment_id)->delete();
            }

            $delete_post_comment = DB::table('comments')->where('post_id', $request->post_id)->delete();

            if ($delete_post || $delete_post_image || $delete_post_like || $delete_post_tag || $delete_post_save || $delete_post_comment) {
                return response()->json([
                    'status' => 200,
                    'message' => "he post was successfully deleted."
                ], 200);
            } else {

                return response()->json([
                    'status' => 500,
                    'message' => "Failed to delete the post."
                ], 500);
            }
        } else {
            return response()->json([
                "status" => 401,
                "message" => "please login to your account",
            ], 401);
        }
    }

    public function detail($post_id)
    {

        $accessToken = request()->cookie('access_token');

        if ($accessToken) {
            $accessTokenModel = PersonalAccessToken::findToken($accessToken);
            if ($accessTokenModel) {
                $userId = $accessTokenModel->tokenable_id;
            }

            $validate = Validator::make(['post_id' => $post_id], [
                'post_id' => 'required|exists:posts,id',
            ]);
            if ($validate->fails()) {
                return response()->json([
                    'status' => 404,
                    'message' => $validate->errors(),
                ], 404);
            }
            $posts['post_detail'] = DB::table('posts')
                ->join('users', 'posts.user_id', 'users.id')
                ->where('posts.id', $post_id)
                ->select([
                    'posts.id',
                    'posts.caption',
                    'posts.user_id',
                    'posts.location',
                    'posts.created_at',
                    'posts.updated_at',
                ])
                // ->groupBy('posts.id')
                ->first();
            // foreach ($posts['post_detail'] as $item) {

            $posts['post_detail']->users = DB::table('users')->where('id', $posts['post_detail']->user_id)->get(['name', 'email', 'username', 'bio', 'profile']);
            foreach ($posts['post_detail']->users as $item_user) {
                $item_user->profile = env('APP_URL') . "/$item_user->profile";
            }
            $posts['post_detail']->tags = DB::table('post_tag')
                ->join('tags', 'post_tag.tag_id', 'tags.id')
                ->where('post_tag.post_id', $posts['post_detail']->id)
                ->select([
                    'tags.id',
                    'tags.tag',
                ])
                ->get();



            $likesCount = DB::table('post_like')
                ->where('post_like.post_id', $posts['post_detail']->id)
                ->count();

            $posts['post_detail']->post_likes = DB::table('post_like')
                ->join('users', 'post_like.user_id', 'users.id')
                ->where('post_like.post_id', $posts['post_detail']->id)
                ->select([
                    'users.name',
                    'users.profile'
                ])
                ->get();
            foreach ($posts['post_detail']->post_likes as $profile_user_like) {
                $profile_user_like->url = env('APP_URL') . "/$profile_user_like->profile";
            }
            $posts['post_detail']->likes_count = $likesCount;

            $countsaves = DB::table('save')->where('save.post_id', $posts['post_detail']->id)->count();

            $posts['post_detail']->saves = DB::table('save')
                ->join('users', 'save.user_id', 'users.id')
                ->where('save.post_id', $posts['post_detail']->id)
                ->select([
                    'users.name',
                    'users.profile',
                ])->where('save.post_id', $posts['post_detail']->id)->get();
            $posts['post_detail']->post_image = DB::table('post_image')->where('post_id', $posts['post_detail']->id)->get();
            foreach ($posts['post_detail']->saves as $profile_user_save) {
                $profile_user_save->url = env('APP_URL') . "/$profile_user_save->profile";
            }
            $posts['post_detail']->saves = $countsaves;

            $posts['post_detail']->post_image = DB::table('post_image')->where('post_id', $posts['post_detail']->id)->get();
            foreach ($posts['post_detail']->post_image as $image_url) {
                $image_url->url = env('APP_URL') . "/$image_url->url";
            }
            // }
            return response()->json([
                'status' => 200,
                "data" => $posts['post_detail'],
            ], 200);
        } else {
            return response()->json([
                "status" => 401,
                "message" => "please login to your account",
            ], 401);
        }
    }
}
