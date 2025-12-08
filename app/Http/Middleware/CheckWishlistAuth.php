<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckWishlistAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!session('wishlist_authenticated')) {
            return redirect()->route('wishlist.access');
        }

        if (!session('wishlist_user_id')) {
            return redirect()->route('wishlist.selectUser');
        }

        return $next($request);
    }
}
