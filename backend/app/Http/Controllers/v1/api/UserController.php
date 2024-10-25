<?php

namespace App\Http\Controllers\v1\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

use function PHPUnit\Framework\isNull;

class UserController extends Controller
{
    public function register(Request $request)
    {
        $response["response"] = [
            "success" => false,
            "message" => "مشکل نا مشخصی به وجود آمده لطفا با پشتیبانی برنامه در ارتباط باشید.",
            "code" => 400,
        ];
        $validate = Validator::make($request->all(), [
            'name' => 'required|string',
            'phone' => 'nullable|unique:users',
            'username' => 'required|unique:users',
            'password' => 'required',
            'bio' => 'nullable',
            'email' => 'required|unique:users',
            'profile' => 'nullable',
        ]);
        if ($validate->fails()) {
            return response()->json([
                'status' => 500,
                'error_message' => $validate->errors(),
            ]);
        }

        $user = User::create([
            'phone' => $request->phone,
            'username' => $request->username,
            'name' => $request->name,
            'bio' => $request->bio,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        if (isset($request->profile)) {
            $file = $request->profile;
            $path = "images/customer$user->id/";
            $name = $request->username . "." . $file->extension();
            Storage::putFileAs($path, $file, $name);
            User::whereId($user->id)->update(['profile' => $path . $name]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'status' => 201,
            'user' => User::find($user->id),
        ]);
        return json_encode($response, JSON_UNESCAPED_UNICODE);
    }


    public function login(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);
        if ($validate->fails()) {
            return response()->json([
                'status' => 401,
                'messages' => $validate->errors(),
            ]);
        }


        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'اطلاعات ورود نادرست است'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 200,
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'شما با موفقیت از سیستم خارج شدید'
        ]);
    }

    public function update(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'id' => 'required|exists:users,id',
            'name' => 'nullable',
            'phone' => 'nullable',
            'username' => 'nullable',
            'password' => 'nullable',
            'bio' => 'nullable',
            'email' => 'nullable',
            'profile' => 'nullable',
        ]);
        if ($validate->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validate->errors()
            ]);
        }
        $info = DB::table('users')->whereId($request->id)->first();
        DB::table('users')->whereId($request->id)->update([
            'name' => $request->name ?? $info->name,
            'phone' => $request->phone,
            'username' => $request->username,
            'bio' => $request->bio ?? $info->bio,
            'email' => $request->email,
        ]);

        if ($request->password) {
            DB::table('users')->whereId($request->id)->update([
                'password' => Hash::make($request->password),
            ]);
        }

        if ($request->profile) {
            $profile = DB::table('users')->whereId($request->id)->first('profile');
            if ($profile->profile != null) {
                unlink($profile->profile);
            }

            $file = $request->profile;
            $path = "images/customer$request->id/";
            $name = $request->username . "." . $file->extension();
            Storage::putFileAs($path, $file, $name);
            User::whereId($request->id)->update(['profile' => $path . $name]);
        }

        return response()->json([
            'status' => 201,
            'message' => "success",
            "data" => DB::table('users')->whereId($request->id)->first()
        ]);
    }
}
