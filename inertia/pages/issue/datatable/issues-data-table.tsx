import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS
// import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional Theme
// import "ag-grid-community/styles/ag-theme-quartz.css";
// import "~/css/custom-ag-grid-theme.css"; // Import your custom theme
import { ColDef } from "ag-grid-community";
import { ComboboxEditor } from "~/components/user-select-cell-editor";
import { toast } from "sonner";
import ColoredBadge from "~/components/colored-badge";
import ExtendedAvatar from "~/components/user-avatar-extended";
import { useForm } from "@inertiajs/react";
import IdCellRenderer from "./cell-renderers/open-button-renderer";
import TypeCellRenderer from "./cell-renderers/type-cell-renderer";
import PriorityCellRenderer from "./cell-renderers/priority-cell-renderer";
import CreatedAtCellRenderer from "./cell-renderers/created-at-cell-renderer";
import DueDateCellRenderer from "./cell-renderers/due-date-cell-renderer";
import { themeQuartz } from "ag-grid-community";
import { themeAlpine } from "ag-grid-community";
import DownTimeTracker from "./cell-renderers/downtime-tracker";
import { useRef, useCallback } from "react";
import { getIssueColumnDefs } from "./issue-table-col-defs";
import { darkTheme } from "~/themes/darktheme";
// to use myTheme in an application, pass it to the theme grid option

interface Issue {
  id: number;
  type: string;
  title: string;
  priority: string;
  status: string;
  due_date: string;
  description: string;
  file: string;
  comments: string;
  activities: string;
  owner?: { name: string };
  assignee?: { name: string };
  creator: { name: string };
  updater: { name: string };
  created_at: string;
  updated_at: string;
}

interface IssueTableProps {
  issues: Issue[];
  onOpenRow: (issue: Issue) => void;
  mode: boolean;
  isAdmin: boolean;
}

const IssueTable: React.FC<IssueTableProps> = ({
  issues,
  onOpenRow,
  mode,
  isAdmin,
}) => {
  const [selectedRow, setSelectedRow] = useState<{ id: number } | null>(null);
  const appliedTheme = mode ? darkTheme : themeAlpine;
  // console.log("mode", mode);
  const form = useForm({
    status: "",
    assigned_to: "",
    priority: "",
    title: "",
    due_date: "",
  });

  useEffect(() => {
    if (
      form.data.status !== "" ||
      form.data.assigned_to !== "" ||
      form.data.priority !== "" ||
      form.data.title !== "" ||
      form.data.due_date !== ""
    ) {
      // Only run if status is not empty
      const issueId = selectedRow?.id; // Assume selectedRow contains the issueId

      form.post(`/issues/${issueId}/update-status`);
      toast.success("Issue has been updated.");
    }
  }, [form.data.status, selectedRow]);

  const handleStatusChange = (
    issueId: number,
    newStatus?: string,
    newAssignee?: string,
    newPriority?: string,
    newTitle?: string,
    newDueDate?: string,
  ) => {
    form.setData({
      status: newStatus ?? rowData.status, // Update status
      assigned_to: newAssignee ?? rowData.assigned_to, // Update assigned user
      priority: newPriority ?? rowData.priority,
      title: newTitle ?? rowData.title,
      due_date: newDueDate ?? rowData.due_date,
    });

    // Update the selected row (optional, based on your app's logic)
    setSelectedRow({ id: issueId });
  };

  const [columnDefs, setColumnDefs] = useState<ColDef[]>(
    getIssueColumnDefs({ isAdmin, onOpenRow, handleStatusChange }),
  );

  const rowData = issues.map((issue) => ({
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
    owner_id: issue.owner?.name,
    assigned_to: issue.assignee?.name || "N/A",
    created_by: issue.creator.name || "N/A",
    updated_by: issue.updater.name || "N/A",
    created_at: issue.created_at,
    updated_at: issue.updated_at,
    creator: issue.creator,
    updater: issue.updater,
    downtime_start_time: issue.downtime_start_time,
    downtime_end_time: issue.downtime_end_time,
  }));
  const gridRef = useRef(null);

  const onGridReady = useCallback(() => {
    const savedState = window.localStorage.getItem("gridState");
    window.colState = savedState
      ? JSON.parse(savedState)
      : gridRef.current!.api.getColumnState();

    gridRef.current!.api.applyColumnState({
      state: window.colState,
      applyOrder: true,
    });
  }, []);

  const saveMovedState = useCallback(() => {
    if (gridRef.current) {
      window.colState = gridRef.current.api.getColumnState();
      window.localStorage.setItem("gridState", JSON.stringify(window.colState));
    }
  }, []);

  return (
    <div
      className={`${mode ? "ag-theme-quartz-dark" : "ag-theme-quartz"}`}
      style={{ height: 750, width: "100%" }}
    >
      <AgGridReact
        ref={gridRef}
        theme={appliedTheme}
        suppressAutoSize={true}
        columnDefs={columnDefs}
        rowData={rowData}
        pagination={true}
        paginationPageSize={20}
        onGridReady={onGridReady}
        onColumnMoved={saveMovedState}
        onColumnResized={saveMovedState}
      />
    </div>
  );
};

export default IssueTable;
