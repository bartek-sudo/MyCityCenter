<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proposal extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'image_paths',
        'status',
        'department_id',
        'created_by',
        'processed_by',
    ];

    protected $casts = [
        'image_paths' => 'array', 
    ];

    public function replies()
    {
        return $this->hasMany(Reply::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function processedBy()
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
