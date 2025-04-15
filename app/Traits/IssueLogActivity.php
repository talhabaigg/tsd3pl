<?php

namespace App\Traits;

use Illuminate\Support\Facades\Auth;

trait IssueLogActivity
{
    /**
     * Add an activity log for the model.
     *
     * @param string $action
     * @param string|null $old_value
     * @param string $new_value
     * @return void
     */
    public function addActivity($action, $old_value, $new_value, $issue_id = null)
    {
        $issue_id = $issue_id ?? $this->id;  // Default to $this->id if issue_id isn't passed

        $this->activities()->create([
            'issue_id' => $issue_id,  // Use passed issue_id or default to model's id
            'user_id' => Auth::id(),  // Get the authenticated user's ID
            'action' => $action,
            'old_value' => $old_value,
            'new_value' => $new_value
        ]);
    }
}
