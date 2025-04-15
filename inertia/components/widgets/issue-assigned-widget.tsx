import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import ColoredBadge from "~/components/colored-badge";
import SmallAvatar from "../user-avatar-small";
import { IssueAssignedUsersChart } from "./issue-assigned-chart";
const assignees = [
  {
    id: 1,
    name: "John Doe",
    email: "john@test.com",
    region: "US",
    role: "Admin",
    assigned: 16,
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "Jane@test.com",
    region: "US",
    role: "User",
    assigned: 50,
  },
];

const IssueAssignedWidget = () => {
  const [data, setData] = useState(assignees);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">User</TableHead>
            <TableHead className="text-right">Assigned Issues</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((assignee) => (
            <TableRow key={assignee.id}>
              <TableCell>
                <SmallAvatar userFullName={assignee.name} />
              </TableCell>
              <TableCell className="text-right font-medium">
                {assignee.assigned}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default IssueAssignedWidget;
