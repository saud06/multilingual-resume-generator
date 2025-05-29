<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Resume extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'personal_info',
        'experiences',
        'education',
        'skills',
        'languages',
        'projects',
        'style',
        'language',
        'generated_content',
        'pdf_path',
    ];

    protected $casts = [
        'personal_info' => 'array',
        'experiences' => 'array',
        'education' => 'array',
        'skills' => 'array',
        'languages' => 'array',
        'projects' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
