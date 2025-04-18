// components/tables/issue-column-defs.ts
import { ColDef } from "ag-grid-community";
import OpenButtonRenderer from "./cell-renderers/open-button-renderer";
import TypeCellRenderer from "./cell-renderers/type-cell-renderer";
import PriorityCellRenderer from "./cell-renderers/priority-cell-renderer";
import CreatedAtCellRenderer from "./cell-renderers/created-at-cell-renderer";
import DueDateCellRenderer from "./cell-renderers/due-date-cell-renderer";
import DownTimeTracker from "./cell-renderers/downtime-tracker";
import ExtendedAvatar from "~/components/user-avatar-extended";
import { ComboboxEditor } from "./cell-renderers/user-select-cell-editor";

interface GetIssueColumnDefsParams {
  isAdmin: boolean;
  onOpenRow: (issue: any) => void;
  handleStatusChange: (
    issueId: number,
    newStatus?: string,
    newAssignee?: string,
    newPriority?: string,
    newTitle?: string,
    newDueDate?: string,
  ) => void;
}

export const getIssueColumnDefs = ({
  isAdmin,
  onOpenRow,
  handleStatusChange,
}: GetIssueColumnDefsParams): ColDef[] => [
  {
    headerName: "Name",
    field: "title",
    flex: 8,
    resizable: true,
    minWidth: 400,
    editable: isAdmin,
    cellClass: "font-bold",
    hide: false,
    singleClickEdit: true,
    onCellValueChanged: (event: any) => {
      const issueId = event.data.id;
      const newTitle = event.newValue;
      handleStatusChange(issueId, undefined, undefined, undefined, newTitle);
    },
  },
  {
    headerName: "Action",
    hide: false,
    resizable: false,
    minWidth: 120,
    maxWidth: 120,
    cellRenderer: (params: any) => <OpenButtonRenderer data={params.data} />,
  },
  {
    headerName: "Lost Time",
    field: "downtime_start_time",
    minWidth: 120,
    cellRenderer: (params: any) => (
      <DownTimeTracker value={params.value} data={params.data} />
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
      const issueId = event.data.id;
      const newPriority = event.newValue;
      handleStatusChange(issueId, undefined, undefined, newPriority);
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
    onCellValueChanged: (event: any) => {
      const issueId = event.data.id;
      const newStatus = event.newValue;
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
    cellDataType: "date",
    cellRenderer: DueDateCellRenderer,
    onCellValueChanged: (event: any) => {
      const issueId = event.data.id;
      const newDueDate = event.newValue;
      handleStatusChange(
        issueId,
        undefined,
        undefined,
        undefined,
        undefined,
        newDueDate,
      );
    },
  },
  {
    headerName: "Owner",
    field: "owner_id",
    cellClass: "text-center",
    editable: false,
    hide: window.innerWidth <= 768,
    cellEditor: ComboboxEditor,
    onCellValueChanged: (event: any) => {
      const issueId = event.data.id;
      const newAssignee = event.newValue;
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
    singleClickEdit: true,
    hide: window.innerWidth <= 768,
    editable: isAdmin,
    cellEditor: ComboboxEditor,
    onCellValueChanged: (event: any) => {
      const issueId = event.data.id;
      const newAssignee = event.newValue;
      const newStatus = event.data.status;
      handleStatusChange(issueId, newStatus, newAssignee);
    },
    cellRenderer: (props: { value: string | undefined }) => (
      <ExtendedAvatar userFullName={props.value} />
    ),
  },
  {
    headerName: "Created by",
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
];
