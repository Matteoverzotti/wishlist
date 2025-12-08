<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WishlistItemStatus extends Model
{
    protected $fillable = ['item_id', 'marked_by_user_id', 'status'];

    public function item(): BelongsTo
    {
        return $this->belongsTo(WishlistItem::class, 'item_id');
    }

    public function markedByUser(): BelongsTo
    {
        return $this->belongsTo(WishlistUser::class, 'marked_by_user_id');
    }
}
