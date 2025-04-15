// @ts-nocheck
import AuthenticatedLayout from "~/components/layouts/authenticated-layout";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardHeader,
} from "~/components/ui/card";
import { Head } from "@inertiajs/react";
import IssueForm from "~/components/issue-form";
import { usePage } from "@inertiajs/react";
export default function Dashboard() {
  
  return (
    <AuthenticatedLayout>
      <Head title="Report an Issue" />

      <div className="flex justify-center items-center  py-10">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Report an issue</CardTitle>
            <CardDescription>
              Use this form to report systemic issues that impact the business.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IssueForm loggedIn={loggedIn}/>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
