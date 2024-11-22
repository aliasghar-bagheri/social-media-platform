<?php

namespace App\Http\Controllers\v1\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

use function PHPUnit\Framework\isNull;

class UserController extends Controller
{
    public $token;

    public function register(Request $request)
    {
        $response["response"] = [
            "success" => false,
            "message" => "you've proble please call with app suported.",
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
                'status'=>'401',
                'messages'=>$validate->errors(),
            ],401);
        }
        $user_id = Str::uuid();
        $user = User::create([
            'id' => $user_id,
            'phone' => $request->phone,
            'username' => $request->username,
            'name' => $request->name,
            'bio' => $request->bio,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);
        if (isset($request->profile)) {
            $file = $request->profile;
            $path = "images/customer$user_id/";
            $name = $request->username . "." . $file->extension();
            Storage::putFileAs($path, $file, $name);
            User::whereId($user_id)->update(['profile' => $path . $name]);
        }

        // Create the access token (short-lived)
        $accessToken = $user->createToken('auth_token')->plainTextToken;
        // Create the refresh token (longer lifespan)
        $refreshToken = $user->createToken('refresh_token')->plainTextToken;
        $this->token = $user_id;
        // Set cookies for both tokens
        $domain = "localhost";
        $accessTokenCookie = cookie('access_token', $accessToken, 15, '/', $domain, false, true, false, 'Lax'); // 15 minutes expiry
        $refreshTokenCookie = cookie('refresh_token', $refreshToken, 60 * 24 * 30, '/', $domain, false, true, false, 'Lax'); // 30 days expiry
        return response()->json([
            'status' => 201,
            'message' => 'Register successful',
            'user' => $user,
        ],201)->withCookie($accessTokenCookie)->withCookie($refreshTokenCookie);
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
            ],401);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                "status" => 401,
                'message' => 'Invalid login credentials'
            ],401);
        }
        // سایر کدهای اعتبارسنجی و ایجاد توکن‌ها
        $accessToken = $user->createToken('auth_token')->plainTextToken;
        $refreshToken = $user->createToken('refresh_token')->plainTextToken;

        // تنظیم کوکی‌ها
        $accessTokenCookie = cookie('access_token', $accessToken, 15, '/', 'localhost', false, true, false, 'Lax');
        $refreshTokenCookie = cookie('refresh_token', $refreshToken, 60 * 24 * 30, '/', 'localhost', false, true, false, 'Lax');

        return response()->json([
            'user' => $user,
            'status' => 200,
            'message' => 'Login successful',
        ],200)->withCookie($accessTokenCookie)->withCookie($refreshTokenCookie);
    }

    public function logout() {
        $accessTokenCookie = Cookie::make('access_token', '', -1, '/', 'localhost', false, true, false, 'Lax');
        $refreshTokenCookie = Cookie::make('refresh_token', '', -1, '/', 'localhost', false, true, false, 'Lax');
    
        // بازگشت پاسخ با حذف کوکی‌ها
        return response()->json([
            'status' => 201,
            'message' => 'Logout successful'
        ],201)->withCookie($accessTokenCookie)->withCookie($refreshTokenCookie);
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
            ],401);
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
        ],201);
    }
}
