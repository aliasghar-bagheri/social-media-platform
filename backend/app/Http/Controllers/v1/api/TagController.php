<?php

namespace App\Http\Controllers\v1\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class TagController extends Controller
{
    public function store(Request $request) {
        $validate = Validator::make($request->all(),[
            'tag'=>"required|string|unique:tags",
        ]);
        if($validate->fails())
        {
            return response()->json([
                'status'=>401,
                "error_message"=>$validate->errors(),
            ]);
        }

        DB::table('tags')->insert([
            'tag'=>$request->tag
        ]);

        return response()->json([
            'status'=>201,
        ]);
    }
}
