<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\IssueComment;

class NewIssueCommentNotification extends Notification implements ShouldQueue
{
    use Queueable;
    protected $comment;
    /**
     * Create a new notification instance.
     */
    public function __construct(IssueComment $comment)
    {
        $this->comment = $comment->load(relations: 'creator');
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        $mail = (new MailMessage)
            ->subject('💬 New Comment on Issue: ' . $this->comment->issue->title)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('A new comment has been added to the issue **' . $this->comment->issue->title) // Fixed "commented by"
            ->line('📝 **Commenter:** ' . $this->comment->creator->name)
            ->line('💬 **Comment:** ' . $this->comment->text)
            ->action('🔍 View Issue', url('/issues/' . $this->comment->issue_id))
            ->line('Thank you!');
        return $mail;
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
