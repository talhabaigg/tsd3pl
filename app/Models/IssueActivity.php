<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IssueActivity extends Model
{
    protected $fillable = ['issue_id', 'user_id', 'action', 'old_value', 'new_value'];

    public function issue()
    {
        return $this->belongsTo(Issue::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
