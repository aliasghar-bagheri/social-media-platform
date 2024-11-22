<?php

namespace App\Http\Controllers\v1\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function list()
    {
        // return Str::uuid();
        $posts['all_post'] = DB::table('posts')
            ->join('users', 'posts.user_id', 'users.id')
            ->join('post_image', 'posts.id', 'post_image.post_id')
            ->leftJoin('post_tag', 'posts.id', 'post_tag.post_id')
            ->leftJoin('tags', 'post_tag.tag_id', 'tags.id')
            ->leftJoin('comments', 'posts.id', 'comments.post_id')
            ->leftJoin('comment_reply', 'comments.id', 'comment_reply.comment_id')
            // ->leftJoin('liked','posts.id','liked.post_id')
            // ->leftJoin('save','posts.id','save.post_id')
            ->select([
                'posts.id as post_id',
                'posts.caption',
                'posts.location',
                'posts.updated_at',
                'users.name as user_name',
                'tags.tag as tag_name',
                'comments.content',
                'comments.pin',
                'comments.updated_at as update_comment',
                'comment_reply.content as content_comment_reply',
                'comment_reply.updated_at as update_comment_reply',
            ])
            ->groupBy('posts.id')
            ->get();
        foreach ($posts['all_post'] as $item) {
            $item->likes = DB::table('like')->where('post_id', $item->post_id)->exit();
            $item->saves = DB::table('save')->where('post_id', $item->post_id)->count();
            $item->post_image = DB::table('post_image')->where('post_id', $item->post_id)->get();
        }
        return response()->json([
            'status' => 200,
            "data" => $posts['all_post'],
        ],200);
    }
    public function store(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'caption' => 'required',
            'location' => 'nullable',
            'image_post' => 'required|min:1|array',
            "tag_id" => "nullable|exists:tags,id"
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => 401,
                "messages" => $validate->errors(),
            ],401);
        }
        $post_id = Str::uuid();
        DB::table('posts')->insert([
            'id' => $post_id,
            'user_id' => $request->user_id,
            'caption' => $request->caption,
            'location' => $request->location,
        ]);
        if (isset($request->image_post)) {
            for ($i = 0; $i < sizeof($request->image_post); $i++) {
                $path = "images_post/users/$request->user_id/posts/$post_id";
                $file = $request->image_post[$i];
                $random_name = rand(100, 9999);
                $name = $random_name . "." . $file->extension();
                Storage::putFileAs($path, $file, $name);
                DB::table('post_image')->insert([
                    'post_id' => $post_id,
                    'url' => "$path/$name",
                ]);
            }
        }

        if (isset($request->tag_id)) {
            for ($j = 0; sizeof($request->tag_id) > $j; $j++) {
                DB::table('post_tag')->insert([
                    'post_id' => $post_id,
                    'url' => $request->tag_id[$j],
                ]);
            }
        }
        $data = DB::table('posts')
            ->join('users', 'posts.user_id', 'users.id')
            ->leftJoin('post_tag', 'posts.id', 'post_tag.post_id')
            ->leftJoin('tags', 'post_tag.tag_id', 'tags.id')
            ->leftJoin('comments', 'posts.id', 'comments.post_id')
            ->leftJoin('comment_reply', 'comments.id', 'comment_reply.comment_id')
            // ->leftJoin('liked','posts.id','liked.post_id')
            // ->leftJoin('save','posts.id','save.post_id')
            ->where('posts.user_id', $request->user_id)
            ->select([
                'posts.id as post_id',
                'posts.caption',
                'posts.location',
                'posts.updated_at',
                'users.name as user_name',
                'tags.tag as tag_name',
                'comments.content',
                'comments.pin',
                'comments.updated_at as update_comment',
                'comment_reply.content as content_comment_reply',
                'comment_reply.updated_at as update_comment_reply',
            ])
            ->groupBy('posts.id')
            ->get();
        foreach ($data as $item) {
            $item->images_post = DB::table('post_image')->where('post_id', $item->post_id)->get();
        }
        return $data;
        return response()->json([
            'status' => 201,
            "data" => $data,
        ],201);
    }
}
