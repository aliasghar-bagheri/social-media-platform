<?php

namespace App\Http\Controllers\v1\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Laravel\Sanctum\PersonalAccessToken;

class LikeController extends Controller
{
    public function like(Request $request)
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
            DB::table('post_like')->insert([
                "user_id" => $userId,
                "post_id" => $request->post_id,
            ]);

            return response()->json([
                'status' => 200,
                "essage" => "like post successfully.",
            ], 200);
        } else {
            return response()->json([
                "status" => 401,
                "message" => "please login to your account",
            ], 401);
        }
    }
    public function unlike(Request $request)
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
            $delete_like = DB::table('post_like')->where("user_id", $userId)->where("post_id", $request->post_id)->delete();

            if ($delete_like) {
                return response()->json([
                    'status' => 200,
                    "message" => "delete like is successfully",
                ], 200);
            } else {
                return response()->json([
                    'status' => 500,
                    "data" => "You have problem for delte like",
                ], 500);
            }
        } else {
            return response()->json([
                "status" => 401,
                "message" => "please login to your account",
            ], 401);
        }
    }
}
