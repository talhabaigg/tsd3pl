<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Issue;
use Illuminate\Support\Str;
use App\Models\IssueComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Notifications\NewIssueCommentNotification;
use Illuminate\Support\Collection;
class IssueCommentController extends Controller
{
    public function store(Request $request): void
    {
        $validated = $request->validate([
            'issue_id' => 'required|exists:issues,id',
            'text' => 'required|string|max:50',
            'file' => 'nullable|file|mimes:jpg,png,pdf,mp4|max:20480', // Adjust based on your file types
        ]);

        $filePath = null;

        if ($request->hasFile('file')) {
            // Generate a unique filename using UUID
            $uuid = Str::uuid()->toString();
            $extension = $request->file('file')->getClientOriginalExtension();
            $newFilename = $uuid . '.' . $extension;

            // Store the file in S3 with public visibility
           $filePath = Storage::disk('s3')->putFileAs('comments', $request->file('file'), $newFilename);
        }

        // Create the comment with the file path (if any)
        $comment = IssueComment::create([
            'issue_id' => $validated['issue_id'],
            'user_id' => auth()->id(), // Assuming the user is logged in
            'text' => $validated['text'],
            'file' => $filePath ? Storage::disk('s3')->url('comments/' . $newFilename) : null,
        ]);
        $issue = Issue::with('owner')->find($validated['issue_id']); // Ensure owner relation is loaded
        $commenterId = auth()->id();
        $owner = $issue->owner; // Owner is stored in `$issue->owner`
        $assignee = $issue->assigned_to ? User::find($issue->assigned_to) : null; // Get assignee if set

        $recipients = collect([$owner, $assignee])
            ->filter(fn($user) => $user && $user->id !== $commenterId) // Remove nulls and commenter
            ->unique('id'); // Ensure unique recipients

        // Send notifications
        $recipients->each(fn($recipient) => $recipient->notify(new NewIssueCommentNotification($comment)));
        return;
    }

    public function update(Request $request, $id): void
    {
        // Find the issue comment by ID
        $issueComment = IssueComment::find($id);

        // Validate the input text field
        $validated = $request->validate([
            'text' => 'required|string|max:50',
        ]);

        // Update the comment's text
        if ($issueComment) {
            // Update the comment and return the updated comment
            $issueComment->update($validated); 
            return ; // Return the updated comment
        }
        return ;
    }

}
