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
        Schema::create('comment_reply', function (Blueprint $table) {
            $table->string('id',50);
            $table->string('comment_id',50);
            // $table->foreign('comment_id')->references('id')->on('comments');
            $table->string('post_id',50);
            // $table->foreign('post_id')->references('id')->on('posts')->onDelete('cascade');
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
        Schema::dropIfExists('comment_reply');
    }
};
