<?php

namespace App\Models;

use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Model;
use App\Traits\IssueLogActivity;
use Illuminate\Database\Eloquent\SoftDeletes;

class Issue extends Model
{
    use SoftDeletes;
    use IssueLogActivity;
    protected $fillable = [
        'type',
        'title',
        'description',
        'file',
        'priority',
        'status',
        'assigned_to',
        'created_by',
        'owner_id',
        'updated_by',
        'due_date',
    ];


    protected static function booted()
    {
        
        // static::created(function ($issue) {
        //     // Now that the issue is created, log the activity
        //     $issue->addActivity('created', null, $issue->toJson(), $issue->id);
        // });
        // static::updating(function ($issue) {
        //     // Set updated_by when updating the issue
        //     $issue->updated_by = Auth::id();
        //     $original = $issue->getOriginal(); // Get the original (old) values
        //     $changes = $issue->getDirty(); // Get the changed (new) values

        //     foreach ($changes as $field => $newValue) {
        //         $oldValue = $original[$field] ?? null;  // Get the old value or null if not set
        //         // Only log activity if the field has changed
        //         if ($oldValue !== $newValue) {
        //             if ($field === 'assigned_to') {
        //                 // Get the user object based on the ID
        //                 $newUser = \App\Models\User::find($newValue);
        //                 $oldUser = \App\Models\User::find($oldValue);
        //                 $newValue = $newUser ? $newUser->name : 'Unknown User';
        //                 $oldValue = $oldUser ? $oldUser->name : 'Unknown User';
        //             }
        //             $issue->addActivity("changed $field", $oldValue, $newValue, $issue->id);
        //         }
        //     }
        // });
    }

    public function getUserForIssueType(string $type)
    {
        // Define a mapping of issue types to user IDs
        $userAssignment = [
            'product_quality' => 1, // User ID for Product Quality
            'it_hardware' => 1,     // User ID for IT Hardware
            'warehouse_operations' => 1,          // User ID for System issues
            'it_applications' => 1,     // User ID for IT Software
            'safety' => 1, // User ID for Human Resources
        ];

        // Return the corresponding user ID or null if not found
        return $userAssignment[$type] ?? 1;
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function comments()
    {
        return $this->hasMany(IssueComment::class);
    }

    public function activities()
    {
        return $this->hasMany(IssueActivity::class);  // Assuming your activity model is named IssueActivity
    }


}
