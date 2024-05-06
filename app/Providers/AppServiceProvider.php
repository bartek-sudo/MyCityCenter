<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::define('view-all-proposals', function (User $user) {
            return $user->role_id == 3 || $user->role_id == 2;
           });

        Gate::define('is-admin', function (User $user) {
            return $user->role_id == 3;
           });

        Gate::define('is-worker', function (User $user) {
            return $user->role_id == 2;
           });

        Gate::define('is-citizen', function (User $user) {
            return $user->role_id == 1;
           });

        Gate::define('access-proposal', function (User $user, $proposal) {
            return $user->role_id == 3 || $user->role_id == 2 || $proposal->created_by == $user->id;
           });

    }

}
