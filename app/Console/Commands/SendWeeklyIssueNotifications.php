<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Issue;
use Illuminate\Support\Facades\Mail;
use App\Mail\IssueReminder;

class SendWeeklyIssueNotifications extends Command
{
    protected $signature = 'send:weekly-issue-notifications';
    protected $description = 'Send weekly email notifications to issue owners about pending issues.';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $owners = User::has('issues')->get();

        foreach ($owners as $owner) {
            $newIssues = $owner->issues()->where('created_at', '>=', now()->subWeek())->get();
            $newIssueCount = $newIssues->count();
            $issues = $owner->issues()
            ->where('status', '!=', 'resolved')
            ->whereNotIn('id', $newIssues->pluck('id')) // Exclude new issues
            ->get();
            $issueCount = $issues->count();
            $deletedIssues = $owner->issues()->onlyTrashed()->where('deleted_at', '>=', now()->subWeek())->get();
            $deletedIssueCount = $deletedIssues->count();
            $allIssues = $issues->merge($newIssues)->merge($deletedIssues);
            $allIssueCount = $allIssues->count();
            if ($allIssueCount > 0 || $newIssueCount > 0) {

                Mail::to($owner->email)->send(new IssueReminder($issueCount, $issues, $newIssueCount, $newIssues, $deletedIssues, $deletedIssueCount));
            }
        }

        $this->info('Weekly issue notifications sent.');
    }
    
}
