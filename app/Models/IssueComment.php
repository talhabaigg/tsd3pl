<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IssueComment extends Model
{
    protected $fillable = ['issue_id', 'user_id', 'text', 'file'];
    public function issue()
    {
        return $this->belongsTo(Issue::class);
    }
    public function creator()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

}
