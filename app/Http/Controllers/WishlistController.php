<?php

    namespace App\Http\Controllers;

    use App\Models\WishlistUser;
    use App\Models\WishlistItem;
    use App\Models\WishlistItemStatus;
    use Illuminate\Http\Request;
    use Inertia\Inertia;

    class WishlistController extends Controller
    {
        public function index(Request $request)
        {
            $currentUser = WishlistUser::findOrFail(session('wishlist_user_id'));
            $users = WishlistUser::with(['items.statuses.markedByUser'])->get();

            return Inertia::render('Wishlist/Index', [
                'currentUser' => $currentUser,
                'users' => $users->map(function ($user) use ($currentUser) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'items' => $user->items->map(function ($item) use ($currentUser, $user) {
                            $data = [
                                'id' => $item->id,
                                'name' => $item->name,
                                'description' => $item->description,
                                'link' => $item->link,
                            ];

                            // Don't show status for own items
                            if ($user->id !== $currentUser->id) {
                                $data['status'] = $item->getStatusForUser($currentUser->id);

                                // Get the status info for all users (to show who bought/wants to buy)
                                $anyStatus = $item->statuses->first();
                                if ($anyStatus) {
                                    $data['statusInfo'] = [
                                        'status' => $anyStatus->status,
                                        'markedByUserName' => $anyStatus->markedByUser->name,
                                    ];
                                }
                            }

                            return $data;
                        }),
                    ];
                }),
            ]);
        }

        public function addItem(Request $request)
        {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'link' => 'nullable|url',
            ], [
                'name.required' => 'Numele cadoului este obligatoriu.',
                'name.max' => 'Numele cadoului nu poate avea mai mult de :max caractere.',
                'link.url' => 'Link-ul trebuie să fie un URL valid.',
            ]);

            $userId = session('wishlist_user_id');

            WishlistItem::create([
                'user_id' => $userId,
                'name' => $validated['name'],
                'description' => $validated['description'],
                'link' => $validated['link'],
            ]);

            return back();
        }

        public function deleteItem(WishlistItem $item)
        {
            // Verify the item belongs to the current user
            if ($item->user_id !== (int)session('wishlist_user_id')) {
                abort(403);
            }

            $item->delete();
            return back();
        }

        public function updateItemStatus(Request $request, WishlistItem $item)
        {
            $validated = $request->validate([
                'status' => 'required|in:planning,bought,none',
            ]);

            $currentUserId = session('wishlist_user_id');

            // Users can't mark their own items
            if ($item->user_id === $currentUserId) {
                abort(403);
            }

            if ($validated['status'] === 'none') {
                WishlistItemStatus::where('item_id', $item->id)
                    ->where('marked_by_user_id', $currentUserId)
                    ->delete();
            } else {
                WishlistItemStatus::updateOrCreate(
                    [
                        'item_id' => $item->id,
                        'marked_by_user_id' => $currentUserId,
                    ],
                    [
                        'status' => $validated['status'],
                    ]
                );
            }

            return back();
        }
    }
