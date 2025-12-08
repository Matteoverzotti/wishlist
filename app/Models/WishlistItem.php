<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WishlistItem extends Model
{
    protected $fillable = ['user_id', 'name', 'description', 'link', 'order'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(WishlistUser::class, 'user_id');
    }

    public function statuses(): HasMany
    {
        return $this->hasMany(WishlistItemStatus::class, 'item_id');
    }

    public function getStatusForUser($userId): ?string
    {
        $status = $this->statuses()->where('marked_by_user_id', $userId)->first();
        return $status?->status;
    }
}
