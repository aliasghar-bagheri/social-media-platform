<?php

namespace App\Http\Controllers\v1\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Laravel\Sanctum\PersonalAccessToken;

class TagController extends Controller
{
    public function index(Request $request)
    {
        $accessToken = request()->cookie('access_token');

        if ($accessToken) {
            $accessTokenModel = PersonalAccessToken::findToken($accessToken);
            if ($accessTokenModel) {
                $userId = $accessTokenModel->tokenable_id;
            }
            $validate = Validator::make($request->all(), [
                "search" => "nullable",
            ]);

            if ($validate->fails()) {
                return response()->json([
                    'status' => 401,
                    "messages" => $validate->errors(),
                ], 401);
            }
            $data["list_tags"] = DB::table('tags')->where("tag", "LIKE", "%$request->search%")->get();

            return response()->json([
                'status' => 200,
                "data" => $data["list_tags"],
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
                'tag' => "required|string|unique:tags",
            ]);
            if ($validate->fails()) {
                return response()->json([
                    'status' => 401,
                    "error_message" => $validate->errors(),
                ], 401);
            }

            DB::table('tags')->insert([
                'id' => str::uuid(),
                'tag' => $request->tag
            ]);

            return response()->json([
                'status' => 201,
                'messages' => 'tag created successfully.'
            ], 201);
        } else {
            return response()->json([
                "status" => 401,
                "message" => "please login to your account",
            ], 401);
        }
    }
}
