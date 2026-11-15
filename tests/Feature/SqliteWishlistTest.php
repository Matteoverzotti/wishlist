<?php

use App\Models\WishlistItem;
use App\Models\WishlistItemStatus;
use App\Models\WishlistUser;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('the wishlist works with a fresh SQLite database', function () {
    expect(config('database.default'))->toBe('sqlite');

    $this->get('/health')
        ->assertOk()
        ->assertJson(['database' => 'OK', 'storage' => 'OK']);

    $this->post('/access', ['password' => config('wishlist.access_password')])
        ->assertRedirect(route('wishlist.selectUser'));

    $this->post('/create-user', ['name' => 'Alice'])
        ->assertRedirect(route('wishlist.index'));

    $alice = WishlistUser::where('name', 'Alice')->firstOrFail();

    $this->get('/wishlist')->assertOk();

    $this->post('/wishlist/items', [
        'name' => 'Book',
        'description' => 'First edition',
        'link' => 'https://example.com/book',
    ])->assertRedirect();

    $item = WishlistItem::where('user_id', $alice->id)->firstOrFail();

    $this->patch("/wishlist/items/{$item->id}", [
        'name' => 'Updated book',
        'description' => 'Second edition',
        'link' => 'https://example.com/updated-book',
    ])->assertRedirect();

    $this->assertDatabaseHas('wishlist_items', [
        'id' => $item->id,
        'name' => 'Updated book',
    ]);

    $bob = WishlistUser::create(['name' => 'Bob']);

    $this->post('/select-user', ['user_id' => $bob->id])
        ->assertRedirect(route('wishlist.index'));

    $this->patch("/wishlist/items/{$item->id}/status", [
        'status' => 'planning',
    ])->assertRedirect();

    $this->assertDatabaseHas('wishlist_item_statuses', [
        'item_id' => $item->id,
        'marked_by_user_id' => $bob->id,
        'status' => 'planning',
    ]);

    $this->post('/select-user', ['user_id' => $alice->id])
        ->assertRedirect(route('wishlist.index'));

    $this->delete("/wishlist/items/{$item->id}")->assertRedirect();

    $this->assertDatabaseMissing('wishlist_items', ['id' => $item->id]);
    expect(WishlistItemStatus::count())->toBe(0);
});
