<?php

use App\Models\User;
use Inertia\Inertia;
use App\Models\Issue;
use App\Models\IssueActivity;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\UserController;
use App\Http\Controllers\IssueController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\IssueCommentController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'isLoggedIn' => auth()->check(),
    ]);
})->name('welcome');

Route::get('/dashboard', function () {
    return redirect()->route('issue.index');
})->middleware(['auth', 'verified'])->name('dashboard');



Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::middleware('role:admin')->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::post('/update-role', [UserController::class, 'updateRole'])->name('users.updateRole');
    });
});
    
Route::resource('issue', IssueController::class);
Route::post('/issue/store', [IssueController::class, 'store'])->name('issue.store');

// web.php
Route::post('/issues/{id}/update-status', [IssueController::class, 'updateStatus'])->name('issues.updateStatus');
Route::post('/issue-comments', [IssueCommentController::class, 'store'])->name('issue-comments.store');
Route::put('/issue-comments/{id}', [IssueCommentController::class, 'update'])->name('issue-comments.update');
Route::get('/issue-comments/{issueId}', [IssueCommentController::class, 'getCommentsByIssueId'])->name('issue-comments.getCommentsByIssueId');
Route::get('/api/latest-comments', [IssueCommentController::class, 'latest'])->name('api.latestComments');

Route::get('/get-users', [UserController::class, 'getUsers'])->name('users.getUsers');

require __DIR__ . '/auth.php';