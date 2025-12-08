<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wishlist_users', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        Schema::create('wishlist_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('wishlist_users')->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('link')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        Schema::create('wishlist_item_statuses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->constrained('wishlist_items')->onDelete('cascade');
            $table->foreignId('marked_by_user_id')->constrained('wishlist_users')->onDelete('cascade');
            $table->enum('status', ['planning', 'bought']);
            $table->timestamps();
            
            $table->unique(['item_id', 'marked_by_user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wishlist_item_statuses');
        Schema::dropIfExists('wishlist_items');
        Schema::dropIfExists('wishlist_users');
    }
};
