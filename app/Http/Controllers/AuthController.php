<?php

namespace App\Http\Controllers;

use App\Models\WishlistUser;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function showAccessPage()
    {
        if (session('wishlist_authenticated')) {
            return redirect()->route('wishlist.selectUser');
        }

        return Inertia::render('Auth/Access');
    }

    public function verifyAccess(Request $request)
    {
        $validated = $request->validate([
            'password' => 'required|string',
        ]);

        Log::info('Access attempt to wishlist', ['request' => $request->all()]);


        if ($validated['password'] !== config('wishlist.access_password')) {
            return back()->withErrors(['password' => 'Parolă de acces incorectă.']);
        }
        session(['wishlist_authenticated' => true]);
        return redirect()->route('wishlist.selectUser');
    }

    public function showSelectUser()
    {
        if (!session('wishlist_authenticated')) {
            return redirect()->route('wishlist.access');
        }

        $users = WishlistUser::orderBy('name')->get();

        return Inertia::render('Auth/SelectUser', [
            'users' => $users,
        ]);
    }

    public function selectUser(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:wishlist_users,id',
        ]);

        session(['wishlist_user_id' => $validated['user_id']]);
        return redirect()->route('wishlist.index');
    }

    public function createUser(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:wishlist_users,name',
        ]);

        $user = WishlistUser::create(['name' => $validated['name']]);
        session(['wishlist_user_id' => $user->id]);

        return redirect()->route('wishlist.index');
    }

    public function logout()
    {
        session()->forget(['wishlist_authenticated', 'wishlist_user_id']);
        return redirect()->route('wishlist.access');
    }
}
