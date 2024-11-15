<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->string('id',50);
            $table->string('user_id',50);
            // $table->foreign('user_id')->references('id')->on('users');
            $table->string('post_id',50);
            // $table->foreign('post_id')->references('id')->on('posts')->onDelete('cascade');
            $table->tinyInteger('pin')->default(0);
            $table->string('content');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
