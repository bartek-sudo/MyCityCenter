<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProposalController;
use App\Http\Controllers\ReplyController;
use Illuminate\Support\Facades\Route;


Route::redirect('/', '/dashboard');

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->name('dashboard');

Route::resource('department', DepartmentController::class);

Route::middleware(['auth', 'verified',])->group(function () {

    Route::middleware('role:admin')
        ->prefix('admin')
        ->group(function () {
            Route::resource('user', UserController::class);
        });

    Route::get('/proposal/my-proposals', [ProposalController::class, 'myProposals'])
        ->name('proposal.myProposals');
    Route::resource('proposal', ProposalController::class);

    Route::resource('reply', ReplyController::class);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
