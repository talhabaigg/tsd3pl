import ColoredBadge from "~/components/colored-badge";
import ExtendedAvatar from "~/components/user-avatar-extended";
import DateLabelAgo from "~/components/date-label-ago";
import IssueCommentBox from "~/components/issue-comment-box";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent } from "~/components/ui/card";
import IssueForm from "~/components/issue-form";
import { ScrollArea } from "~/components/ui/scroll-area";
import { FilePreview } from "~/components/comment-file-preview";
import IssueActivityBox from "~/components/issue-activity-box";
import IssueDetailsTab from "./tab-details";
const IssueSheetTabs = ({ selectedRow }) => {
  return (
    <Tabs defaultValue="details">
      <TabsList className="dark:bg-transparent">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="comments">Comments</TabsTrigger>
        <TabsTrigger value="log">Log</TabsTrigger>
        <TabsTrigger value="edit">Edit</TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <IssueDetailsTab selectedRow={selectedRow} />
      </TabsContent>
      <TabsContent value="comments">
        <div className="min-h-screen flex items-center justify-center  ">
          <IssueCommentBox
            issueId={selectedRow ? selectedRow.id : 0}
            // @ts-ignore
            existingComments={selectedRow ? selectedRow.comments : []}
          />
        </div>
      </TabsContent>
      <TabsContent value="log">
        <div className="">
          {" "}
          <ScrollArea className="h-[700px] sm:h-[600px]  xl:h-[800px]  rounded-md   ">
            <IssueActivityBox
              issueId={selectedRow ? selectedRow.id : 0}
              existingActivities={selectedRow ? selectedRow.activities : []}
            ></IssueActivityBox>
          </ScrollArea>
        </div>
      </TabsContent>
      <TabsContent value="edit">
        <Card className=" p-4">
          <IssueForm issue={selectedRow} />
        </Card>
      </TabsContent>
    </Tabs>
  );
};
export default IssueSheetTabs;
