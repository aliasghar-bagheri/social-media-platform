<?php

namespace App\Http\Controllers\v1\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Laravel\Sanctum\PersonalAccessToken;

class SaveController extends Controller
{
    public function list()
    {
        $accessToken = request()->cookie('access_token');

        if ($accessToken) {
            $accessTokenModel = PersonalAccessToken::findToken($accessToken);
            if ($accessTokenModel) {
                $userId = $accessTokenModel->tokenable_id;
            }

            $save_list = DB::table('save')
                ->join('users', 'save.user_id', 'users.id')
                ->join('posts', 'save.post_id', 'posts.id')
                // ->join('post_image','posts.id','post_image.post_id')
                ->select([
                    'posts.id as post_id',
                    'posts.caption',
                    'posts.location',
                    'users.name',
                    'users.profile',
                ])
                ->where('save.user_id', $userId)
                ->get();
            foreach ($save_list as $item) {
                $item->profile = env('APP_URL') . "/$item->profile";
                $image_post = DB::table('post_image')->where('post_id', $item->post_id)->get();
                foreach ($image_post as $item_image) {
                    $item_image->url = env('APP_URL') . "/$item_image->url";
                }
            }
            return response()->json([
                'status' => 200,
                'data' => $save_list,
            ]);
        } else {
            return response()->json([
                "status" => 401,
                "message" => "please login to your account",
            ], 401);
        }
    }

    public function save(Request $request)
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
            DB::table('save')->insert([
                "user_id" => $userId,
                "post_id" => $request->post_id,
            ]);

            return response()->json([
                'status' => 200,
                "essage" => "save post successfully.",
            ], 200);
        } else {
            return response()->json([
                "status" => 401,
                "message" => "please login to your account",
            ], 401);
        }
    }
    public function unsave(Request $request)
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
            $delete_like = DB::table('save')->where("user_id", $userId)->where("post_id", $request->post_id)->delete();

            if ($delete_like) {
                return response()->json([
                    'status' => 200,
                    "message" => "delete save is successfully",
                ], 200);
            } else {
                return response()->json([
                    'status' => 500,
                    "data" => "You have problem for delete save",
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
