<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class BackupDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'backup:database';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Backup SQLite database and upload to S3';

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function handle()
    {
        // Define the SQLite database path
        $dbPath = base_path('database/database.sqlite'); // Adjust this path if needed

        // Generate the backup file name
        $date = Carbon::now()->format('Y-m-d_H-i-s');
        $backupFileName = "db_backup_{$date}.sqlite";

        // Copy the database to a temporary backup location
        $backupFilePath = storage_path("app/{$backupFileName}");
        copy($dbPath, $backupFilePath);

        // Upload the backup to S3
        $uploaded = Storage::disk('s3')->put("backups/{$backupFileName}", fopen($backupFilePath, 'r+'));

        if ($uploaded) {
            $this->info('Database backup uploaded successfully to S3!');
        } else {
            $this->error('Failed to upload the backup to S3.');
        }

        // Optionally, remove the local backup file after uploading
        unlink($backupFilePath);
    }
}
