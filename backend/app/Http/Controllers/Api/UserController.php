<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::all(), 200);
    }

    public function show($id)
    {
        $user = User::find($id);
        if ($user) {
            return response()->json($user, 200);
        }
        return response()->json(['message' => 'User not found'], 404);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'email' => 'required|email|unique:user,email',
            'password' => 'required|string|min:8',
            'no_hp' => 'required|string',
            'alamat' => 'required|string',
            'role' => 'required|in:owner,admin,penjoki',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'nama' => $request->input('nama'),
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password')),
            'no_hp' => $request->input('no_hp'),
            'alamat' => $request->input('alamat'),
            'role' => $request->input('role'),
        ]);

        return response()->json([
            'message' => 'User created successfully',
            'data' => $user
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Tentukan aturan validasi dasar
        $rules = [
            'nama' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:user,email,' . $id,
            'no_hp' => 'sometimes|required|string',
            'alamat' => 'sometimes|required|string',
            'role' => 'sometimes|required|in:owner,admin,penjoki',
        ];

        // Tambahkan aturan validasi untuk password hanya jika password diisi
        if ($request->filled('password')) {
            $rules['password'] = 'required|string|min:8';
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Ambil data yang akan diupdate
        $dataToUpdate = $request->only([
            'nama',
            'email',
            'no_hp',
            'alamat',
            'role'
        ]);

        // Update password jika diisi
        if ($request->filled('password')) {
            $dataToUpdate['password'] = bcrypt($request->input('password'));
        }

        // Update user dengan data yang ada
        $user->update($dataToUpdate);

        return response()->json([
            'message' => 'User updated successfully',
            'data' => $user
        ], 200);
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if ($user) {
            $user->delete();
            return response()->json([
                'message' => 'User deleted successfully',
                'data' => $user
            ], 200);
        }
        return response()->json(['message' => 'User not found'], 404);
    }
}
