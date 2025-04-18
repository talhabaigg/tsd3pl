import { useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "~/components/layouts/authenticated-layout";
import IssueTable from "~/pages/issue/datatable/issues-data-table";
import IssueFormModal from "~/components/issue-form-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { KanbanBoard } from "~/components/KanbanBoard";
import { MultiSelect } from "~/components/multi-select";
import { Cat, Dog, Fish, Rabbit, Turtle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { Head } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import IssueFormQR from "~/components/issue-form-guest-qr";
import { Task } from "~/components/TaskCard";
import IssueSheetTabs from "./partials/sheet-tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { set } from "date-fns";
import { match } from "assert";

interface Issue {
  id: number;
  type: string;
  title: string;
  description: string;
  file: string;
  priority: string;
  status: string;
  due_date: string;
  assigned_to: string;
  created_by: string;
  creator: { name: string };
  updated_at: string;
  updater: { name: string };
  created_at: string;
  comments: string;
  activities: any[];
  assignee: { name: string };
  downtime_start_time: string;
  downtime_end_time: string;
}

interface IssuesProps {
  issues: {
    data: Issue[];
  };
}

export default function Dashboard() {
  const { issues, auth, issue_types } = usePage().props;
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Issue | null>(null);
  const [open, setOpen] = React.useState(false);
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedCreator, setSelectedCreator] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [selectedOwner, setSelectedOwner] = useState("");
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>(issues.data);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const moveForm = useForm({ status: "" });
  const isAdmin = auth.user?.isAdmin;

  const typeList = issue_types.map((type) => ({
    value: type.name,
    label: type.name,
  }));
  // const typeList = [
  //   { value: "it_hardware", label: "IT Hardware" },
  //   { value: "product_quality", label: "Product Quality" },
  //   { value: "it_applications", label: "IT Applications" },
  //   { value: "warehouse_operations", label: "Warehouse Operations" },
  //   { value: "safety", label: "Safety" },
  // ];
  const statusList = [
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "resolved", label: "Resolved" },
  ];
  // Fetch and filter issues based on selected filters and search query
  const fetchIssues = () => {
    const newFilteredIssues = issues.data.filter((issue) => {
      const matchesType =
        selectedType.length > 0
          ? selectedType.includes(issue.type) // Check if the issue's type is in the selected types
          : true;
      const matchesStatus =
        selectedStatus.length > 0
          ? selectedStatus.includes(issue.status) // Check if the issue's status is in the selected statuses
          : true;

      const matchesPriority = selectedPriority
        ? issue.priority === selectedPriority
        : true;
      const matchesCreator = selectedCreator
        ? issue.creator.name === selectedCreator
        : true;
      const matchesAssignee = selectedAssignee
        ? issue.assignee.name === selectedAssignee
        : true;
      const matchesOwner = selectedOwner
        ? issue.owner.name === selectedOwner
        : true;
      const matchesTitle = issue.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()); // Match title with search query

      return (
        matchesType &&
        matchesPriority &&
        matchesStatus &&
        matchesCreator &&
        matchesAssignee &&
        matchesOwner &&
        matchesTitle // Include title match in filter
      );
    });
    setFilteredIssues(newFilteredIssues);
  };

  useEffect(() => {
    fetchIssues(); // Call fetch function whenever any filter or search changes
  }, [
    issues.data,
    selectedType,
    selectedPriority,
    selectedStatus,
    selectedCreator,
    selectedAssignee,
    selectedOwner,
    searchQuery, // Add search query to dependencies
  ]);
  const clearFilters = () => {
    setSelectedType([]);
    setSelectedPriority("");
    setSelectedStatus([]);
    setSelectedCreator("");
    setSelectedAssignee("");
    setSelectedOwner("");
    setSearchQuery(""); // Clear search query
    fetchIssues(); // Refetch issues to reset filters
  };
  const rowData = (issue: Issue) => ({
    id: issue.id,
    type: issue.type,
    title: issue.title,
    priority: issue.priority,
    status: issue.status,
    due_date: issue.due_date,
    description: issue.description,
    file: issue.file,
    comments: issue.comments,
    activities: issue.activities,
    assigned_to: issue.assignee?.name || "N/A",
    created_by: issue.creator.name || "N/A",
    updated_by: issue.updater.name || "N/A",
    created_at: issue.created_at,
    updated_at: issue.updated_at,
    creator: issue.creator,
    updater: issue.updater,
    downtime_start_time: issue.downtime_start_time,
    downtime_end_time: issue.downtime_end_time,
  });

  const taskHandlers = {
    customMoveHandler: (task: Task, status: string) => {
      moveForm.data.status = status;
      moveForm.post(`/issues/${task.id}/update-status`);
    },

    customClickHandler: (id: any) => {
      fetch(route("issue.show", id))
        .then((response) => response.json())
        .then((data) => {
          const formattedData = rowData(data);
          onOpenRow(formattedData);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setIsDarkMode(savedTheme === "dark");
  }, []);

  const onOpenRow = (rowData) => {
    setSelectedRow(rowData);
    setOpen(true);
  };

  return (
    <AuthenticatedLayout>
      <Head title="View Issues" />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="max-w-md mx-auto shadow-lg rounded-lg p-6">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold">
              Issue #{selectedRow?.id}
            </SheetTitle>
          </SheetHeader>
          <IssueSheetTabs selectedRow={selectedRow} />
        </SheetContent>
      </Sheet>
      <Tabs defaultValue="table" className="w-full">
        <div className="flex justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xlg:grid-cols-8  gap-2">
            <MultiSelect
              options={typeList}
              onValueChange={setSelectedType}
              defaultValue={selectedType}
              placeholder="Filter by type"
              variant="inverted"
              animation={2}
              maxCount={2}
              className="col-span-1 sm:col-span-2"
            />
            <MultiSelect
              options={statusList}
              onValueChange={setSelectedStatus}
              defaultValue={selectedType}
              placeholder="Filter by status"
              variant="inverted"
              animation={2}
              maxCount={2}
              className="col-span-1 sm:col-span-2"
            />
            <Select
              value={selectedPriority}
              onValueChange={setSelectedPriority}
            >
              <SelectTrigger className="w-[250px] sm:w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Priority</SelectLabel>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={selectedCreator} onValueChange={setSelectedCreator}>
              <SelectTrigger className="w-[250px] sm:w-[180px]">
                <SelectValue placeholder="Filter by creator" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Creator</SelectLabel>
                  {[
                    ...new Set(issues.data.map((issue) => issue.creator.name)),
                  ].map((creatorName, index) => (
                    <SelectItem key={index} value={creatorName}>
                      {creatorName}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select value={selectedOwner} onValueChange={setSelectedOwner}>
              <SelectTrigger className="w-[250px] sm:w-[180px]">
                <SelectValue placeholder="Filter by owner" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Owner</SelectLabel>
                  {[
                    ...new Set(issues.data.map((issue) => issue.owner.name)),
                  ].map((ownerName, index) => (
                    <SelectItem key={index} value={ownerName}>
                      {ownerName}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              value={selectedAssignee}
              onValueChange={setSelectedAssignee}
            >
              <SelectTrigger className="w-[250px] sm:w-[180px]">
                <SelectValue placeholder="Filter by assigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Assigned</SelectLabel>
                  {[
                    ...new Set(issues.data.map((issue) => issue.assignee.name)),
                  ].map((assigneeName, index) => (
                    <SelectItem key={index} value={assigneeName}>
                      {assigneeName}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col sm:flex-row  gap-2">
            {isAdmin && <IssueFormQR />}
            <IssueFormModal loggedIn={true} />
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <Input
            type="text"
            placeholder="Search by title"
            className="w-64 my-2"
            value={searchQuery} // Set input value to searchQuery state
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
          />
          <Button variant="link" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
        <TabsContent value="table" className="w-full">
          <IssueTable
            issues={filteredIssues} // Use filtered issues
            onOpenRow={onOpenRow}
            isAdmin={isAdmin}
            mode={isDarkMode}
          />
        </TabsContent>
        <TabsContent value="kanban" className="mt-10">
          <KanbanBoard
            issues={filteredIssues} // Use filtered issues
            taskHandlers={taskHandlers}
          />
        </TabsContent>
      </Tabs>
    </AuthenticatedLayout>
  );
}
