<?php

namespace App\Http\Controllers\v1\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class TagController extends Controller
{
    public function index(Request $request)
    {
        $validate = Validator::make($request->all(), [
            "search" => "nullable",
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => 401,
                "messages" => $validate->errors(),
            ]);
        }

        $data["list_tags"] = DB::table('tags')->where("tag", "LIKE", "%$request->search%")->get();

        return response()->json([
            'status' => 201,
            "data" => $data["list_tags"],
        ]);
    }
    public function store(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'tag' => "required|string|unique:tags",
        ]);
        if ($validate->fails()) {
            return response()->json([
                'status' => 401,
                "error_message" => $validate->errors(),
            ]);
        }

        DB::table('tags')->insert([
            'id' => str::uuid(),
            'tag' => $request->tag
        ]);

        return response()->json([
            'status' => 201,
        ]);
    }
}
