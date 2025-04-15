import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import AuthenticatedLayout from "~/components/layouts/authenticated-layout";
import { toast } from "sonner";

export default function CreateUser() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route("users.store"), {
      onFinish: () => reset("password", "password_confirmation"),
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Register" />
      <div className="w-full max-w-sm mx-auto p-2">
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={data.name}
              autoComplete="name"
              autoFocus
              onChange={(e) => setData("name", e.target.value)}
              // @ts-ignore
              error={errors.name}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={data.email}
              autoComplete="username"
              onChange={(e) => setData("email", e.target.value)}
              // @ts-ignore
              error={errors.email}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              value={data.password}
              autoComplete="new-password"
              onChange={(e) => setData("password", e.target.value)}
              // @ts-ignore
              error={errors.password}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password_confirmation">Confirm Password</Label>
            <Input
              id="password_confirmation"
              type="password"
              name="password_confirmation"
              value={data.password_confirmation}
              autoComplete="new-password"
              onChange={(e) => setData("password_confirmation", e.target.value)}
              // @ts-ignore
              error={errors.password_confirmation}
              requireds
            />
          </div>

          <div className="flex items-center justify-end">
            <Link href={route("users.index")}>
              <Button type="button" className="ml-4" variant="link">
                Cancel
              </Button>
            </Link>

            <Button className="ml-4" loading={processing}>
              Create user
            </Button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}
