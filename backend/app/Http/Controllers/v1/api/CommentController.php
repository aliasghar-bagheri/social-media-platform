<?php

namespace App\Http\Controllers\v1\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Laravel\Sanctum\PersonalAccessToken;

class CommentController extends Controller
{
    public function comment(Request $request)
    {
        $accessToken = request()->cookie('access_token');

        if ($accessToken) {
            $accessTokenModel = PersonalAccessToken::findToken($accessToken);
            if ($accessTokenModel) {
                $userId = $accessTokenModel->tokenable_id;
            }

            $validate = Validator::make($request->all(), [
                "post_id" => "required|exists:posts,id",
                "content" => "required",
            ]);
            if ($validate->fails()) {
                return response()->json([
                    "status" => 401,
                    "message" => $validate->errors(),
                ]);
            }
            $id = Str::uuid();
            $check_id = DB::table('comments')->where('id', $id)->exists();
            if ($check_id) {
                $id = Str::uuid();
            }
            DB::table('comments')->insert([
                'id' => $id,
                'user_id' => $userId,
                'post_id' => $request->post_id,
                'content' => $request->content,
            ]);
            return response()->json([
                "status" => 201,
                "message" => "successfully submit your comment",
            ]);
        } else {
            return response()->json([
                "status" => 401,
                "message" => "please login to your account",
            ], 401);
        }
    }

    public function comment_reply(Request $request)
    {
        $accessToken = request()->cookie('access_token');

        if ($accessToken) {
            $accessTokenModel = PersonalAccessToken::findToken($accessToken);
            if ($accessTokenModel) {
                $userId = $accessTokenModel->tokenable_id;
            }

            $validate = Validator::make($request->all(), [
                "user_id" => "required|exists:users,id",
                "post_id" => "required|exists:posts,id",
                "comment_id" => "required|exists:comments,id",
                "content" => "required",
            ]);
            if ($validate->fails()) {
                return response()->json([
                    "status" => 401,
                    "message" => $validate->errors(),
                ]);
            }

            
            $id = Str::uuid();
            $check_id = DB::table('comment_reply')->where('id', $id)->exists();
            if ($check_id) {
                $id = Str::uuid();
            }
            
            DB::table('comment_reply')->insert([
                'id' => $id,
                'user_id' => $userId,
                'comment_id' => $request->comment_id,
                'post_id' => $request->post_id,
                'content' => $request->content,
            ]);
            return response()->json([
                "status" => 201,
                "message" => "successfully submit your comment",
            ]);
        } else {
            return response()->json([
                "status" => 401,
                "message" => "please login to your account",
            ], 401);
        }
    }
}
