<?php

namespace App\Http\Controllers\v1\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PostController extends Controller
{
    public function list() {
        $posts['all_post'] = DB::table('posts')
        ->join('users','posts.user_id','users.id')
        ->join('post_image','posts.id','post_image.post_id')
        ->leftJoin('post_tag','posts.id','post_tag.post_id')
        ->leftJoin('tags','post_tag.tag_id','tags.id')
        ->leftJoin('comments','posts.id','comments.post_id')
        ->leftJoin('comment_reply','comments.id','comment_reply.comment_id')
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
        foreach($posts['all_post'] as $item)
        {
            $item->likes = DB::table('like')->where('post_id',$item->post_id)->exit();
            $item->saves = DB::table('save')->where('post_id',$item->post_id)->exit();
        }
    }
}
