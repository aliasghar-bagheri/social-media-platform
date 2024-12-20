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
    public function list()
    {
        $accessToken = request()->cookie('access_token');

        if ($accessToken) {
            $accessTokenModel = PersonalAccessToken::findToken($accessToken);
            if ($accessTokenModel) {
                $userId = $accessTokenModel->tokenable_id;
            }
            $posts['all_post'] = DB::table('posts')
                ->join('users', 'posts.user_id', 'users.id')
                ->leftJoin('comments', 'posts.id', 'comments.post_id')
                ->leftJoin('comment_reply', 'comments.id', 'comment_reply.comment_id')
                ->select([
                    'posts.id',
                    'posts.caption',
                    'posts.user_id',
                    'posts.location',
                    'posts.created_at',
                    'posts.updated_at',
                    // 'comments.content',
                    // 'comments.pin',
                    // 'comments.updated_at as update_comment',
                    // 'comment_reply.content as content_comment_reply',
                    // 'comment_reply.updated_at as update_comment_reply',
                ])
                // ->groupBy('posts.id')
                ->get();
            foreach ($posts['all_post'] as $item) {

                $item->users = DB::table('users')->where('id', $item->user_id)->get();

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
                    $profile_user_like->url = env('APP_URL') . "/$profile_user_like->url";
                }
                $item->likes_count = $likesCount;

                $countsaves = DB::table('save')->where('save.post_id', $item->id)->count();

                $item->saves = DB::table('save')
                    ->join('users', 'save.user_id', 'users.id')
                    ->where('save.post_id', $item->id)
                    ->select([
                        'users.name',
                        'users.profile',
                    ])->where('save.post_id', $item->id)->get();
                $item->post_image = DB::table('post_image')->where('post_id', $item->id)->get();
                foreach ($item->saves as $profile_user_save) {
                    $profile_user_save->url = env('APP_URL') . "/$profile_user_save->url";
                }
                $item->saves = $countsaves;

                $item->post_image = DB::table('post_image')->where('post_id', $item->id)->get();
                foreach ($item->post_image as $image_url) {
                    $image_url->url = env('APP_URL') . "/$image_url->url";
                }
            }
            return response()->json([
                'status' => 200,
                "data" => $posts['all_post'],
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
                'image_post' => 'required|min:1|array',
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
                    $path = "images_post/users/$userId/posts/$post_id";
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
}
