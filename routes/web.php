<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProposalController;
use App\Http\Controllers\ReplyController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', '/dashboard');

Route::middleware(['auth', 'verified',])->group(function () {

    // only admin can access this route
    Route::middleware('role:admin')
        ->prefix('admin')
        ->group(function () {
            Route::resource('user', UserController::class);
        });

    // Route::middleware('role:citizen')
    //     ->prefix('citizen')
    //     ->group(function () {
    //         Route::resource('user', UserController::class);
    //     });

    Route::get('/proposal/my-proposals', [ProposalController::class, 'myProposals'])
        ->name('proposal.myProposals');
    Route::resource('proposal', ProposalController::class);

    Route::get('/dashboard', fn () => Inertia::render('Dashboard'))
        ->name('dashboard');

    Route::resource('reply', ReplyController::class);


    Route::resource('department', DepartmentController::class);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
