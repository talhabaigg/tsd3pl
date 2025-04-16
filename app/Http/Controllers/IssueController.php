<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Issue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use App\Notifications\AssignedIssueNotification;
use Illuminate\Support\Facades\Log;
use App\Models\IssueCategory;
class IssueController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
{
    $user = Auth::user();

    // Fetch issues based on role
    $issuesQuery = Issue::with([
        'user', 'owner', 'assignee', 'creator', 'updater', 'comments.creator', 'activities.user'
    ])
    ->orderBy('status', 'asc')
    ->orderBy('created_at', 'desc');

    // If user is not an admin, restrict to only their created issues
    if (!$user->isAdmin()) {
        $issuesQuery->where('created_by', $user->id);
    }

    $issue_types = IssueCategory::all();

    $issues = $issuesQuery->paginate(1000); // Adjust pagination as needed

    // Pass data to the Inertia view
    return Inertia::render('issue/index', [
        'issues' => $issues,
        'issue_types' => $issue_types,
    ]);
}

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('issue/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request->all());
        $validated = $request->validate([
            'type' => 'required|string',
            'name' => 'required|string',
            'priority' => 'required',
            'description' => 'required|string',
            'file' => 'nullable|file|mimes:jpg,png,pdf,mp4|max:20480', // Adjust based on your file types
            'fullName' => 'nullable|string',
            'email' => 'nullable|email',
        ]);
        
        
        // Log the validated data
        \Log::info('Validated Issue Data:', $validated);

        if ($request->id) {
            $issue = Issue::findOrFail($request->id);  // Find the issue by ID
            $issue->update([  // Update the issue with new data
                'type' => $request->type,
                'title' => $request->name,
                'priority' => $request->priority,
                'description' => $request->description,
            ]);
            return redirect()->route('issue.index')->with('success', 'Issue updated successfully');
        } else {
            // Check if user is logged in
            if (Auth::check()) {
                $user = Auth::user();
            } else {
                // If not logged in, create a new user

            $user = User::firstorCreate([
                'email' => $request->email,
            ], [
                'name' => $request->fullName,
                'password' => bcrypt('password'),
            ]);
            }
            // Define the default owners for each issue type
            
            // $owners = [
            //     'it_application' => 1,
            //     'warehouse_operations' => 1,
            //     'safety' => 1,
            //     'it_hardware' => 1,
            //     'product_quality' => 1,
            // ];
            $ownerForCategory = IssueCategory::where('name', $request->type)->value('user_id');
          
            $ownerId = $ownerForCategory ?? 1; 
            // If no ID, create a new issue
            $issue = Issue::create([
                'type' => $request->type,
                'title' => $request->name,
                'priority' => $request->priority,
                'status' => 'pending',  // Default status
                'description' => $request->description,
                'created_by' => $user->id,
                'owner_id' => $ownerId,
                'assigned_to' => $ownerId,
                'updated_by' => $user->id,
            ]);
            
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $originalFilename = $file->getClientOriginalName(); // Get the original file name
                $newFilename = 'issue_' . $issue->id . '_' . $originalFilename; // Add prefix

                // Upload file with public visibility
                Storage::disk('s3')->put('issues/' . $newFilename, file_get_contents($file), 'public');

                // Get the URL of the uploaded file
                $fileUrl = Storage::disk('s3')->url('issues/' . $newFilename);

                // Update the issue with the file path
                $issue->update([
                    'file' => $fileUrl,
                ]);
            }
            if (!Auth::check()) {
                return redirect()->back()->with('success', 'Issue submitted successfully as a guest.');
            }
            return redirect()->route('issue.index')->with('success', 'Issue created successfully');
        }

    }
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $issue = Issue::with(
            'user',
            'assignee',
            'owner',
            'creator',
            'updater',
            'comments.creator',
            'activities.user'
        )->findOrFail($id);
        // dd($issue);

        return Inertia::render('issue/show', ['issue' => $issue]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = Auth::user();

        if (!$user->isAdmin()) {
            return redirect()->route('issue.index')->with('error', 'You are not authorized to perform this action.');
        }
      
        $issue = Issue::findOrFail($id);
        $issue->delete();

        return redirect()->route('issue.index')->with('success', 'Issue deleted successfully');
    }

    public function updateStatus(Request $request, $id): void
    {
        $validated = $request->validate([
            'status' => 'nullable|string', // Validate status options
            'assigned_to' => 'nullable', // Validate if user exists
            'priority' => 'nullable',
            'title' => 'nullable',
            'due_date' => 'nullable|date',
        ]);
        // dd($request->all());

        $issue = Issue::findOrFail($id);
        $previousAssignee = $issue->assigned_to;

        $issue->update($validated);
        // Check if 'assigned_to' changed
        if (!empty($validated['assigned_to']) && $previousAssignee != $validated['assigned_to']) {
            $assignedUser = User::find($validated['assigned_to']);
            if ($assignedUser) {
                $assignedUser->notify(new AssignedIssueNotification($issue));
            }
        }

        return;
    }
    public function startDowntime(Issue $issue)
{
    if (is_null($issue->downtime_start_time)) {
        // Start downtime
        $issue->downtime_start_time = now();
        $message = 'Downtime started.';
    } elseif (is_null($issue->downtime_end_time)) {
        // Stop downtime
        $issue->downtime_end_time = now();
        $message = 'Downtime stopped.';
        log::info('Downtime stopped for issue ID: ' . $issue->id);
    } else {
        // Already started and stopped
        return response()->json(['success' => false, 'message' => 'Downtime already ended.'], 400);
    }

    $issue->save();

    return response()->json([
        'success' => true,
        'message' => $message,
        'data' => $issue,
    ]);
}

}
