<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    public function proposals()
    {
        return $this->hasMany(Proposal::class);
    }

    public $timestamps = false;
}
