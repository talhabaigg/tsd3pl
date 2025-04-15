import ColoredBadge from "~/components/colored-badge";
import ExtendedAvatar from "~/components/user-avatar-extended";
import DateLabelAgo from "~/components/date-label-ago";
import { Card, CardContent } from "~/components/ui/card";
import { FilePreview } from "~/components/comment-file-preview";
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
  user_id: number;
  text: string;
  file: string | null;
  created_at: string;
  updated_at: string;
  creator: User;
};

type Activity = {
  id: number;
  issue_id: number;
  user_id: number;
  action: string;
  old_value: string | null;
  new_value: string | null;
  created_at: string;
  updated_at: string;
  user: User;
};

type Issue = {
  id: number;
  type: string;
  title: string;
  file: string | File | undefined;
  priority: string;
  status: string;
  description: string;
  comments: Comment[];
  activities: Activity[];
  assigned_to: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  creator: User;
};

const IssueDetailsTab = ({ selectedRow }: { selectedRow: Issue }) => {
  return selectedRow ? (
    <div className="">
      <Card className="p-2  my-2">
        <CardContent className="my-4 space-y-2">
          <div className="font-bold">Title:</div>
          <div className="text-md text-muted-foreground">
            {selectedRow.title}
          </div>
          <div className="font-bold">Description:</div>
          <div className="text-md text-muted-foreground">
            {selectedRow.description}
          </div>
          <div className="font-bold">Uploaded evidence:</div>
          {selectedRow.file && <FilePreview file={selectedRow.file} />}
          <div className="font-bold">Priority:</div>
          <div>
            <ColoredBadge value={selectedRow.priority} />
          </div>
          <div className="font-bold">Status:</div>
          <div>
            <ColoredBadge value={selectedRow.status} />
          </div>
          <div className="font-bold">Assigned To:</div>
          <ExtendedAvatar userFullName={selectedRow.assigned_to} />
          <div className="font-bold">Submitted by:</div>
          <ExtendedAvatar userFullName={selectedRow.created_by} />
          <div className="font-bold">Created At:</div>
          <div>
            <DateLabelAgo date={selectedRow.created_at} />
          </div>
          <div className="font-bold">Last Updated At:</div>
          <div>
            <DateLabelAgo date={selectedRow.updated_at} />
          </div>
        </CardContent>
      </Card>
    </div>
  ) : (
    <p className="mt-4 text-center text-sm text-gray-500">
      <Card className="p-2 mr-10 my-2">Select a row to view details</Card>
    </p>
  );
};

export default IssueDetailsTab;
