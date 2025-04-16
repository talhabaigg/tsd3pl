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
import IdCellRenderer from "./cell-renderers/id-renderer";
import TypeCellRenderer from "./cell-renderers/type-cell-renderer";
import PriorityCellRenderer from "./cell-renderers/priority-cell-renderer";
import CreatedAtCellRenderer from "./cell-renderers/created-at-cell-renderer";
import DueDateCellRenderer from "./cell-renderers/due-date-cell-renderer";
import { themeQuartz } from 'ag-grid-community';
import { themeAlpine } from "ag-grid-community"; 

// to use myTheme in an application, pass it to the theme grid option
const darkTheme = themeQuartz
	.withParams({
        accentColor: "#008B80",
        backgroundColor: "#020000",
        browserColorScheme: "inherit",
        cellHorizontalPaddingScale: 1,
        cellTextColor: "#FFFFFF",
        chromeBackgroundColor: "#00000000",
        fontFamily: "inherit",
        foregroundColor: "#FFF",
        headerBackgroundColor: "#002A26",
        headerFontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            "Segoe UI",
            "Roboto",
            "Oxygen-Sans",
            "Ubuntu",
            "Cantarell",
            "Helvetica Neue",
            "sans-serif"
        ],
        headerFontSize: 14,
        headerFontWeight: 500,
        headerTextColor: "#FFFFFF",
        headerVerticalPaddingScale: 1,
        oddRowBackgroundColor: "#060606",
        rowVerticalPaddingScale: 1
    });
    
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

const IssueTable: React.FC<IssueTableProps> = ({ issues, onOpenRow, mode, isAdmin }) => {
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
    // Set form data for both status and assigned_to
    // @ts-ignore
    form.setData({
      // @ts-ignore
      status: newStatus ?? rowData.status, // Update status
      // @ts-ignore
      assigned_to: newAssignee ?? rowData.assigned_to, // Update assigned user
      // @ts-ignore
      priority: newPriority ?? rowData.priority,
      // @ts-ignore
      title: newTitle ?? rowData.title,
      // @ts-ignore
      due_date: newDueDate ?? rowData.due_date,
    });

    // Update the selected row (optional, based on your app's logic)
    setSelectedRow({ id: issueId });
  };

  // AG Grid column definitions
  const columnDefs: ColDef<Issue>[] = [
    // {
    //   headerName: "ID",
    //   field: "id",
    //   flex: 2,
    //   filter: true,
    //   cellRenderer: (params: any) => (
    //     <IdCellRenderer
    //       value={params.value}
    //       data={params.data}
    //       onOpenRow={onOpenRow}
    //     />
    //   ),
    // },
    {
      headerName: "Name",
      field: "title",
      flex: 8,
      resizable: false,
      autoHeight: true,
      editable: isAdmin,
      cellClass: "font-bold",
      hide: false,
      minWidth: 700,
      singleClickEdit: true,
      wrapText: true,
      
      onCellValueChanged: (event: any) => {
        const issueId = event.data.id; // Get the issue ID
        const newTitle = event.newValue; // Get the new title
        handleStatusChange(issueId, undefined, undefined, undefined, newTitle);
      },
    },
    {
      headerName: "Action",
      hide: false,
      maxWidth: 120,
      cellRenderer: (params: any) => (
        <IdCellRenderer value={params.value} data={params.data} />
      ),
    },
    
    {
      headerName: "Type",
      field: "type",
      filter: false,
      cellClass: "text-left",
      cellRenderer: TypeCellRenderer,
    },
    {
      headerName: "Priority",
      field: "priority",
      filter: false,
      editable: isAdmin,
      cellClass: "text-left",
      cellEditor: "agSelectCellEditor",
      singleClickEdit: true,
      cellEditorParams: {
        values: ["critical", "normal"],
      },
      onCellValueChanged: (event: any) => {
        const issueId = event.data.id; // Get the issue ID
        // @ts-ignore
        const status = rowData.status; // Get the new status
        // @ts-ignore
        const assigned_to = rowData.assigned_to;
        const newPriority = event.newValue; // Get the new priority
        handleStatusChange(issueId, status, assigned_to, newPriority);
      },
      cellRenderer: (params: { value: string }) => (
        <PriorityCellRenderer value={params.value} />
      ),
    },
    {
      headerName: "Status",
      field: "status",
      hide: false,
      filter: false,
      editable: isAdmin,
      cellClass: "text-left",
      cellEditor: "agSelectCellEditor",
      singleClickEdit: true,
      cellEditorParams: {
        values: ["active", "resolved", "pending"],
      },
      onCellValueChanged: (event: { data: { id: any }; newValue: any }) => {
        const issueId = event.data.id; // Get the issue ID
        const newStatus = event.newValue; // Get the new status

        handleStatusChange(issueId, newStatus);
      },
      cellRenderer: (props: { value: string }) => <div>{props.value}</div>,
    },
    {
      headerName: "Due date",
      field: "due_date",
      editable: isAdmin,
      cellClass: "text-left",
      singleClickEdit: true,
      cellEditor: "agDateCellEditor",
      cellDataType: 'date',
      cellRenderer: DueDateCellRenderer,
      onCellValueChanged: (event: { data: { id: any }; newValue: any }) => {
        const issueId = event.data.id; // Get the issue ID
        const newDueDate = event.newValue; // Get the new due date

        handleStatusChange(issueId, undefined, undefined, undefined, undefined, newDueDate);
      }
    },
    {
      headerName: "Owner",
      field: "owner_id",
      cellClass: "text-center",
      singleClickEdit: true,
      editable: false,
      hide: window.innerWidth <= 768,
      cellEditor: ComboboxEditor,
      onCellValueChanged: (event: {
        data: { id: any; status: any };
        newValue: any;
      }) => {
        const issueId = event.data.id; // Get the issue ID
        const newAssignee = event.newValue; // Get the new assignee
        const newStatus = event.data.status;
        handleStatusChange(issueId, newStatus, newAssignee);
      },
      cellRenderer: (props: { value: string | undefined }) => (
        <ExtendedAvatar userFullName={props.value} />
      ),
    },
    {
      headerName: "Assigned to",
      field: "assigned_to",
      cellClass: "text-center",
      singleClickEdit: true,
      hide: window.innerWidth <= 768,
      editable: isAdmin,
      cellEditor: ComboboxEditor,
      onCellValueChanged: (event: {
        data: { id: any; status: any };
        newValue: any;
      }) => {
        const issueId = event.data.id; // Get the issue ID
        const newAssignee = event.newValue; // Get the new assignee
        const newStatus = event.data.status;
        handleStatusChange(issueId, newStatus, newAssignee);
      },
      cellRenderer: (props: { value: string | undefined }) => (
        <ExtendedAvatar userFullName={props.value} />
      ),
    },
    {
      headerName: "Created by",
      // @ts-ignore
      field: "created_by",
      hide: window.innerWidth <= 768,
      cellRenderer: (props: { value: string | undefined }) => (
        <ExtendedAvatar userFullName={props.value} />
      ),
    },
    {
      headerName: "Created At",
      field: "created_at",
      hide: window.innerWidth <= 768,
      cellRenderer: CreatedAtCellRenderer,
    },
    {
      headerName: "Last update",
      field: "updated_at",

      cellRenderer: CreatedAtCellRenderer,
    },
  ];

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
  }));

  return (
    <div
      className={`${mode ? "ag-theme-quartz-dark" : "ag-theme-quartz"}`}
      style={{ height: 750, width: "100%" }}
    >
      <AgGridReact
       theme={appliedTheme}
        suppressAutoSize={true}
        columnDefs={columnDefs}
        rowData={rowData}
        pagination={true}
        paginationPageSize={20}
        defaultColDef={{
          minWidth: 150,
          flex: 4,
          hide: window.innerWidth <= 768,
          resizable: false, // Allow resizing columns
        }}
      />
    </div>
  );
};

export default IssueTable;
