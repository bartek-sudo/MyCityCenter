<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'email_verified_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function role() {
        return $this->belongsTo(Role::class);
    }

    public function proposals() {
        return $this->hasMany(Proposal::class);
    }

    public function replies() {
        return $this->hasMany(Reply::class);
    }

    public function hasRole(string $role) : bool {
        return $this->role->name == $role;
    }

    // public function isAdmin() : bool {
    //     return $this->role_id == DB::table('roles')->where('name', 'admin')->value('id');
    // }

    // public function isWorker() : bool {
    //     return $this->role_id == DB::table('roles')->where('name', 'worker')->value('id');
    // }

    // public function isCitizen() : bool {
    //     return $this->role_id == DB::table('roles')->where('name', 'citizen')->value('id');
    // }
}
