import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { cva } from "class-variance-authority";
import { GripVertical } from "lucide-react";
import { Badge } from "./ui/badge";
import { ColumnId } from "./KanbanBoard";
import SmallAvatar from "./user-avatar-small";
import ColoredBadge from "./colored-badge";

export interface Task {
  id: UniqueIdentifier;
  columnId: ColumnId;
  content: string;
  description: string;
  priority: string;
  type: string;
  assignee: {
    name: string;
  };
}

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
  clickHandler?: () => void;
}

export type TaskType = "Task";

export interface TaskDragData {
  type: TaskType;
  task: Task;
}

export function TaskCard({ task, isOverlay, clickHandler }: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    } satisfies TaskDragData,
    attributes: {
      roleDescription: "Task",
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    cursor: "pointer",
  };

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
      onClick={() => clickHandler?.(task.id)}
    >
      <CardHeader className="px-2 text-wrap py-3  items-center space-between flex flex-row border-b-2 border-secondary relative justify-between">
        <div className="flex items-center">
          <p className="break-words w-64 text-sm truncate" title={task.content}>
            {task.content}
          </p>
        </div>{" "}
        <div className="flex items-center">
          <SmallAvatar userFullName={task.assignee.name}></SmallAvatar>
        </div>
      </CardHeader>
      <CardContent className="px-3 pt-3 pb-6 text-left whitespace-pre-wrap">
        <div className="flex justify-between">
          <p className="break-words flex-wrap text-xs font-light">
            {task.description}
          </p>

          <Button
            variant={"ghost"}
            {...attributes}
            {...listeners}
            className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-grab"
          >
            <span className="sr-only">Move task</span>
            <GripVertical />
          </Button>
        </div>
        <div className="mt-2 space-x-1">
          <ColoredBadge value={task.priority}></ColoredBadge>

          <Badge variant={"outline"} className="ml-auto font-semibold">
            #{task.type}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
