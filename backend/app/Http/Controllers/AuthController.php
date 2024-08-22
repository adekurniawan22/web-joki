<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\ApiToken;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Email Tidak Terdaftar'], 401);
        } else {
            if (!Hash::check($request->password, $user->password)) {
                return response()->json(['message' => 'Password Salah'], 401);
            }
        }

        // Hapus token lama jika ada
        ApiToken::where('user_id', $user->id)->delete();

        // Buat token baru dengan masa berlaku 2 jam
        $token = bin2hex(random_bytes(32));
        $expiresAt = Carbon::now('Asia/Jakarta')->addHours(2);
        // $expiresAt = Carbon::now('Asia/Jakarta')->addMinutes(10);

        ApiToken::create([
            'user_id' => $user->id,
            'token' => $token,
            'expires_at' => $expiresAt,
        ]);

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user_id' => $user->id,
            'role' => $user->role,
            'expires_at' => $expiresAt,
        ]);
    }

    public function logout(Request $request)
    {
        $token = $request->bearerToken();

        if ($token) {
            ApiToken::where('token', $token)->delete();
        }

        return response()->json(['message' => 'Logged out successfully']);
    }
}
