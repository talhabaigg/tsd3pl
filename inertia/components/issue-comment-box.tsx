import React, { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { FilePreview } from "~/components/comment-file-preview";
import { Paperclip } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import CommentList from "~/pages/issue/partials/comment-list";
import { usePage } from "@inertiajs/react";
import { Textarea } from "~/components/ui/textarea";

interface IssueCommentBoxProps {
  issueId: number;
  existingComments: Array<any>;
}

const IssueCommentBox = ({
  issueId,
  existingComments,
}: IssueCommentBoxProps) => {
  const [comments, setComments] = useState(existingComments);
  const [newComment, setNewComment] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const form = useForm({
    issue_id: issueId,
    text: "",
    file: null,
  });
  const { user } = usePage().props.auth;
  useEffect(() => {
    if (form.data.text !== "") {
      form.post("/issue-comments");
    }
  }, [form.data.text]);

  const handleAddComment = () => {
    if (newComment.trim() === "") return;

    const comment = {
      id: comments.length + 1,
      issue_id: issueId,
      creator: { id: user.id, name: user.name },
      text: newComment,
      file,
      created_at: new Date().toISOString(),
    };

    form.setData({
      issue_id: issueId,
      text: newComment,
      file: file,
    });

    toast.success("Comment added");

    setComments([...comments, comment]);
    setNewComment("");
    setFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      console.log(selectedFile);
      setFile(selectedFile);
    }
  };

  return (
    <div className="relative min-h-screen pb-2 ">
      <div className="sticky top-0 pb-2 border-gray-200">
        <div className="flex flex-col gap-2">
          {/* Text Input for Comment */}
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 "
            onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
          />

          {/* File Input and Upload Button */}
          <div className="flex items-center justify-end gap-2">
            <span className="w-16 h-16 flex items-center justify-center">
              {file && <FilePreview file={file} />}
            </span>

            <label htmlFor="file-upload" className="cursor-pointer">
              <Paperclip />
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              accept="image/*,video/*,application/pdf"
              className="hidden"
            />

            <Button onClick={handleAddComment}>Post</Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <CommentList comments={comments} />
    </div>
  );
};

export default IssueCommentBox;
