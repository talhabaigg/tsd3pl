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
        Schema::create('issues', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->string('title');
            $table->longText('description')->nullable();
            $table->string('file')->nullable();
            $table->string('priority');
            $table->string('status');
            $table->string('assigned_to')->constrained('users')->nullable();
            $table->boolean('confirmation')->nullable();
            $table->foreignId('created_by')->constrained('users'); // The user who created the issue
            $table->foreignId('updated_by')->constrained('users'); // The user who submitted the issue
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('issues');
    }
};
