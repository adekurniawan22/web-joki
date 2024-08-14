<?php
// app/Http/Middleware/CheckApiToken.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\ApiToken;
use Carbon\Carbon;

class CheckApiToken
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['message' => 'Token not provided'], 401);
        }

        // Temukan token di database
        $apiToken = ApiToken::where('token', $token)->first();

        if (!$apiToken) {
            return response()->json(['message' => 'Unauthorized or token not found'], 401);
        }

        // Cek apakah token sudah kadaluarsa
        if ($apiToken->expires_at <= Carbon::now('Asia/Jakarta')) {
            // Hapus token yang kadaluarsa
            $apiToken->delete();
            return response()->json(['message' => 'Token expired'], 401);
        }

        // Set user dan role dari token ke request
        $request->attributes->set('user_id_middleware', $apiToken->user_id);

        return $next($request);
    }
}
