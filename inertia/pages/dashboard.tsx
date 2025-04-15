import React, { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { Grip } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import AuthenticatedLayout from "~/components/layouts/authenticated-layout";
import { Card, CardContent } from "~/components/ui/card";
import { Head, usePage } from "@inertiajs/react";
import IssueAssignedWidget from "~/components/widgets/issue-assigned-widget";
import { IssueDepartmentChart } from "~/components/widgets/issue-department-chart";
import { IssueAssignedUsersChart } from "~/components/widgets/issue-assigned-chart";
import LatestComments from "~/components/widgets/issue-comments-widget";
import { ScrollArea } from "~/components/ui/scroll-area";
import IssueWidgetByDepartment from "~/components/widgets/issue-widget-by-department";
import IssueActivityBox from "~/components/issue-activity-box";
import { CardTitle, CardDescription } from "~/components/ui/card";
import { Resizable } from "react-resizable";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import IssueSheetTabs from "./issue/partials/sheet-tabs";

interface Issue {
  id: number;
  type: string;
  title: string;
  description: string;
  file: string;
  priority: string;
  status: string;
  assigned_to: string;
  created_by: string;
  creator: { name: string };
  updated_at: string;
  updater: { name: string };
  created_at: string;
  comments: string;
  activities: any[];
  assignee: { name: string };
}

function SortableCard({
  id,
  children,
  title,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : "auto",
  };
  const state = {
    width: 200,
    height: 200,
  };
  const stylecard = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : "auto",
  };
  return (
    <div ref={setNodeRef} style={style} className="aspect-video group ">
      <Card>
        <div className=" flex justify-between py-4 px-2">
          <CardTitle>{title}</CardTitle>
          {/* Drag Handle Button */}
          <button className="mr-1" {...listeners} {...attributes}>
            <Grip />
          </button>
        </div>
        <div>{children}</div>
      </Card>
    </div>
  );
}

export default function Dashboard() {
  const { existingActivities } = usePage().props as unknown as {
    existingActivities: any[];
  };

  const { existingAssignees } = usePage().props as unknown as {
    existingAssignees: any[];
  };

  const { existingIssuesByDepartment } = usePage().props as unknown as {
    existingIssuesByDepartment: any[];
  };
  console.log("dashboard", existingIssuesByDepartment);
  const [selectedRow, setSelectedRow] = useState<Issue | null>(null);
  const [open, setOpen] = React.useState(false);
  const rowData = (issue: Issue) => ({
    id: issue.id,
    type: issue.type,
    title: issue.title, // Assuming 'title' is a property in issue
    priority: issue.priority,
    status: issue.status,
    description: issue.description,
    file: issue.file, // Assuming 'file' is a property in issue
    comments: issue.comments,
    activities: issue.activities,
    assigned_to: issue.assignee?.name || "N/A", // If assignee exists, get their name, otherwise "N/A"
    created_by: issue.creator.name || "N/A", // If creator exists, get their name, otherwise "N/A"
    updated_by: issue.updater.name || "N/A", // If updater exists, get their name, otherwise "N/A"
    created_at: issue.created_at,
    updated_at: issue.updated_at,
    creator: issue.creator,
    updater: issue.updater,
  });
  const commentClickHandler = (id: any) => {
    console.log("Received comment ID:", id);
    fetch(route("issue.show", id))
      .then((response) => response.json()) // Parse the JSON response
      .then((data) => {
        console.log(data);
        if (data) {
          setSelectedRow(rowData(data));
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  useEffect(() => {
    if (selectedRow) {
      console.log("Updated selectedRow:", selectedRow);
      setOpen(true);
    }
  }, [selectedRow]);
  const cards = [
    {
      id: "chart-users",
      content: (
        <IssueAssignedUsersChart existingAssignees={existingAssignees} />
      ),
      title: "Issues Assigned to Users",
      description: "The below chart displays total issues assigned to users.",
    },
    {
      id: "chart-department",
      content: (
        <IssueDepartmentChart
          existingIssuesByDepartment={existingIssuesByDepartment}
        />
      ),
      title: "Issues by Department",
      description:
        "The below chart displays total active issues by department.",
    },
    {
      id: "comments",
      content: <LatestComments commentClickHandler={commentClickHandler} />,
      title: "Latest Comments",
    },
    {
      id: "activities",
      content: (
        <div className="p-4 h-[350] sm:h-[450px]">
          <ScrollArea className="h-[300px] sm:h-[400px]">
            <IssueActivityBox
              existingActivities={existingActivities}
              commentClickHandler={commentClickHandler}
            />
          </ScrollArea>
        </div>
      ),
      title: "Latest Activity",
    },
  ];

  // const [cardOrder, setCardOrder] = useState(cards.map((card) => card.id));
  const [cardOrder, setCardOrder] = useState<string[]>(
    () =>
      JSON.parse(localStorage.getItem("dashboardCardOrder") || "null") ||
      cards.map((card) => card.id),
  );
  console.log(cardOrder);
  useEffect(() => {
    // Save the updated order to local storage
    localStorage.setItem("dashboardCardOrder", JSON.stringify(cardOrder));
  }, [cardOrder]);
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setCardOrder((prev) => {
        const oldIndex = prev.indexOf(active.id);
        const newIndex = prev.indexOf(over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="Dashboard" />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="max-w-md mx-auto shadow-lg rounded-lg p-6">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold ">
              Issue #{selectedRow?.id}
            </SheetTitle>
          </SheetHeader>
          <IssueSheetTabs selectedRow={selectedRow} />
        </SheetContent>
      </Sheet>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={cardOrder} strategy={rectSortingStrategy}>
          <div className="grid auto-rows-min grid-cols-1 gap-2 md:grid-cols-3">
            {cardOrder.map((id) => {
              const card = cards.find((card) => card.id === id);
              return (
                <SortableCard key={id} id={id} title={card?.title}>
                  <Card className="p-2">
                    <CardDescription>
                      {card?.description || "No description"}
                    </CardDescription>
                    <CardContent>{card?.content}</CardContent>
                  </Card>
                </SortableCard>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </AuthenticatedLayout>
  );
}
