import React, { useState } from "react";
import { ScrollArea } from "~/components/ui/scroll-area";
import CommentCard from "./comment-card";
type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
};

// Type definition for comments
type Comment = {
  id: number;
  issue_id: number;
  text: string;
  file: string | null;
  created_at: string;
  creator: User;
};
interface CommentListProps {
  comments: Comment[];
}
const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  return (
    <div className="flex-1 h-3/4 ">
      <ScrollArea className="h-[600px] sm:h-[700px] xlg:h-[900px] w-full rounded-md">
        {comments.length > 0 ? (
          comments
            .slice()
            .reverse()
            .map((comment, index) => (
              <div key={index}>
                <CommentCard comment={comment} />
              </div>
            ))
        ) : (
          <p className="text-center text-gray-500">No comments found.</p>
        )}
      </ScrollArea>
    </div>
  );
};

export default CommentList;
