export type Issue = {
    id: number;
    type: string;
    title: string;
    description?: string;
    priority: string;
    status: string;
    assigned_to?: string;
    confirmation?: any;
    created_by: number;
    updated_by: number;
    deleted_at?: string;
    created_at?: string;
    updated_at?: string;
    assignee?: User;
    user?: User;
    updater?: User;
    creator?: User;
    comments?: IssueComment[];
    activities?: IssueActivity[];
};
export type IssueActivity = {
    issue?: Issue;
    user?: User;
};
export type IssueComment = {
    id: number;
    issue_id: number;
    user_id: number;
    text: string;
    file?: string;
    created_at?: string;
    updated_at?: string;
    issue?: Issue;
    creator?: User;
};
export type User = {
    isAdmin: any;
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    created_at?: string;
    updated_at?: string;
};
