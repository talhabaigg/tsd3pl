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
const issues = [
  { id: 1, department: "it_hardware", current_number: 10, previous_number: 5 },
  {
    id: 2,
    department: "human_resources",
    current_number: 10,
    previous_number: 25,
  },
  { id: 3, department: "operations", current_number: 10, previous_number: 5 },
];

const IssueWidgetByDepartment = () => {
  const [data, setData] = useState(issues);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Department</TableHead>
          <TableHead className="text-right">Open Issues</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((issue) => (
          <TableRow key={issue.id}>
            <TableCell>
              <ColoredBadge value={issue.department}></ColoredBadge>
            </TableCell>
            <TableCell className="text-right font-medium">
              <span>
                {issue.current_number > issue.previous_number ? (
                  <span>↑</span> // This is the upward arrow
                ) : (
                  <span>↓</span>
                )}
              </span>
              {issue.current_number}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default IssueWidgetByDepartment;
