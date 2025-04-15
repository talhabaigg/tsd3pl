import { usePage } from "@inertiajs/react";
import { Card, CardTitle } from "~/components/ui/card";
import { FilePreview } from "~/components/comment-file-preview";
import SmallAvatar from "~/components/user-avatar-small";
import { useEffect, useState } from "react";
import DateTimeFormatted from "~/components/date-time-formatted";
import { ScrollArea } from "../ui/scroll-area";
import { Car } from "lucide-react";
import { Button } from "../ui/button";
interface UpdatesWidgetProps {
  commentClickHandler?: (id: number) => void; // Accepts comment ID as a parameter
}

const LatestComments = ({ commentClickHandler }: UpdatesWidgetProps) => {
  const { props } = usePage();

  interface Comment {
    id: number;
    issue: {
      id: number;
      name: string;
      type: string;
      status: string;
    };
    creator: {
      id: number;
      name: string;
    };
    text: string;
    file?: string;
    created_at: string;
  }

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the latest comments from the backend
  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/latest-comments");
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data = await response.json();
      setComments(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  if (loading) return <div>Loading comments...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!comments || comments.length === 0) {
    return (
      <Card className="p-20">
        No comments yet. <br />
        Be the first to comment!
      </Card>
    );
  }

  const handleCommentClick = (id: number) => {
    console.log("Comment clicked:", id);
    if (commentClickHandler) {
      commentClickHandler(id); // Call the handler if provided
    }
  };

  return (
    <div className="p-4 h-[350px] sm:h-[450px]">
      <ScrollArea className="h-[300px] mt-2 sm:h-[400px]">
        {comments.map((comment) => (
          <div key={comment.id}>
            <div className="flex justify-start space-y-2">
              <div
                className="p-2 ml-2 w-full flex items-center space-x-4 cursor-pointer dark:hover:bg-gray-900 hover:bg-gray-100"
                onClick={() => handleCommentClick(comment.issue.id)}
              >
                <div>
                  <SmallAvatar userFullName={comment.creator.name} />
                </div>
                <div>
                  {comment.text}
                  {comment.file && (
                    <div className="mt-2">
                      <FilePreview file={comment.file} />
                    </div>
                  )}
                  <div className="space-x-2">
                    <div className="flex items-center justify-between font-light text-xs">
                      <div className="space-x-1">
                        Commented on "issue Id: {comment.issue.id}" on{" "}
                        <DateTimeFormatted date={comment.created_at} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

export default LatestComments;
