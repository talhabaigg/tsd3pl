// @ts-nocheck
import AuthenticatedLayout from "~/components/layouts/authenticated-layout";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardHeader,
  CardFooter,
} from "~/components/ui/card";
import { Archive } from "lucide-react";
import { Head, useForm } from "@inertiajs/react";
import IssueCommentBox from "~/components/issue-comment-box";
import { FilePreview } from "~/components/comment-file-preview";
import {
  Table,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Show({ issue }) {
  const { delete: destroy, processing } = useForm();
  const [open, setOpen] = useState(false);
  console.log(issue.comments);
  const handleDelete = () => {
    destroy(route("issue.destroy", { id: issue.id }), {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title={issue.title} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{issue.title}</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableCell>{issue.description}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableCell>{issue.type}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableCell>{issue.status}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>Priority</TableHead>
                  <TableCell>{issue.priority}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>Creator</TableHead>
                  <TableCell>{issue.creator.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>Owner</TableHead>
                  <TableCell>{issue.owner?.name || "Unassigned"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>Assigned to</TableHead>
                  <TableCell>{issue.assignee?.name || "Unassigned"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableCell>
                    {issue.file ? (
                      <FilePreview file={issue.file} />
                    ) : (
                      "No file attached"
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild className="ml-auto">
                <Button variant="destructive" size="sm">
                  {" "}
                  <Archive />
                  Archive
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Archive Issue</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to archive this issue? This action
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-row justify-between">
                  <Button
                    variant="secondary"
                    className="p-2 m-1 w-1/2"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    className="p-2 m-1 w-1/2"
                    onClick={handleDelete}
                    disabled={processing}
                  >
                    {processing ? "Archiving..." : "Confirm"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
        <Card className="col-span-2">
          <CardHeader>Comments</CardHeader>
          <CardContent>
            <IssueCommentBox
              issueId={issue.id}
              existingComments={issue.comments || []}
            />
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
