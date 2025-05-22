import React, { useState } from "react";
import { Card } from "~/components/ui/card";
import { FilePreview } from "~/components/comment-file-preview";
import SmallAvatar from "~/components/user-avatar-small";
import { usePage, useForm } from "@inertiajs/react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
};

type Comment = {
  id: number;
  issue_id: number;
  text: string;
  file: string | null;
  created_at: string;
  creator: User;
};

const CommentCard = ({ comment }: { comment: Comment }) => {
  const { user } = usePage().props.auth; // Get the current user from Inertia props
  const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
  });

  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const { data, setData, put, processing, errors } = useForm({
    text: comment.text,
    comment_id: comment.id,
  });

  // Handle text change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData("text", e.target.value);
  };

  // Handle save comment update
  const handleSave = () => {
    put(`/issue-comments/${data.comment_id}`, {
      onSuccess: (response) => {
        // Optimistically update the text if needed (optional)
        comment.text = data.text; // Update the comment text in the current component's state
        setIsEditing(false); // Exit edit mode after successful update
      },
      onError: (error) => {
        console.error("Error updating comment:", error); // Handle error
      },
    });
  };

  // Handle Enter key press to trigger save
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Prevent default Enter behavior (new line) and trigger save
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <Card className="space-y-2 p-2 mb-2">
      {/* Avatar */}
      <div className="flex items-center gap-2">
        <SmallAvatar user={comment.creator} />
        <div>
          <p>{comment.creator.name}</p>
          <p className="text-[10px] -mt-1 font-light">{timeAgo}</p>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <div className="flex-1 ml-10">
          {/* Edit or View Comment Text */}
          {isEditing ? (
            <div>
              <Textarea
                value={data.text}
                onChange={handleTextChange}
                onKeyDown={handleKeyPress} // Bind the Enter key/>
              />
              {errors.text && (
                <p className="text-red-500 text-sm">{errors.text}</p>
              )}
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  onClick={() => setIsEditing(false)} // Cancel edit
                  variant="link"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave} // Save updated comment
                  disabled={processing}
                >
                  {processing ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          ) : (
            <p>{comment.text}</p>
          )}

          {/* File Preview (if file exists) */}
          {comment.file && (
            <div className="mt-2">
              <FilePreview file={comment.file} />
            </div>
          )}
        </div>
      </div>

      {/* Edit Button (only show if the user is the comment creator or has permission) */}
      {comment.creator.id === user?.id && !isEditing && (
        <div className="flex justify-end">
          <Button onClick={() => setIsEditing(true)} variant="link">
            Edit
          </Button>
        </div>
      )}
    </Card>
  );
};

export default CommentCard;
