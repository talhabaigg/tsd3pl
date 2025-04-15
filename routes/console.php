<?php

use App\Console\Commands\BackupDatabase;
use App\Console\Commands\SendWeeklyIssueNotifications;
use Illuminate\Support\Facades\Artisan;

Schedule::command(SendWeeklyIssueNotifications::class)->weeklyOn(1, '8:45')->timezone('Australia/Brisbane');
Schedule::command(BackupDatabase::class)->dailyAt('23:00')->timezone('Australia/Brisbane');