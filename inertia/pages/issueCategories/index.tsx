import { useForm } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "~/components/layouts/authenticated-layout";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";

interface Category {
  id: number;
  name: string;
  user: {
    id: number;
    name: string;
  };
}

interface IndexProps {
  categories: Category[];
  users: { id: number; name: string }[];
}

export default function Index({ categories, users }: IndexProps) {
  const {
    data,
    setData,
    post,
    put,
    delete: destroy,
    processing,
    reset,
  } = useForm({
    name: "",
    user_id: "",
  });

  const [categoryId, setCategoryId] = useState<number | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const method = categoryId ? put : post;

    method(
      categoryId
        ? route("issue-categories.update", categoryId)
        : route("issue-categories.store"),
      {
        onSuccess: () => {
          reset();
          setCategoryId(null);
        },
      },
    );
  };

  return (
    <AuthenticatedLayout>
      <div className="max-w-xl mx-auto mt-10 space-y-6">
        <Card className="border-none">
          <CardHeader>
            <CardTitle>
              {categoryId ? "Edit Category" : "Add New Category"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  placeholder="Enter category name"
                  className="w-full"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="user_id">Assign User</Label>
                <Select
                  value={data.user_id}
                  onValueChange={(value) => setData("user_id", value)}
                >
                  <SelectTrigger id="user_id" className="w-full">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-2">
                <Button type="submit" disabled={processing}>
                  {categoryId ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-2">
          {categories.map((category) => (
            <Card key={category.id} className="border-none">
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <div className="font-semibold">{category.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Assigned to: {category.user?.name}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setData({
                        name: category.name,
                        user_id: category.user?.id.toString() || "",
                      });
                      setCategoryId(category.id);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (
                        confirm(
                          "Are you sure you want to delete this category?",
                        )
                      ) {
                        destroy(route("issue-categories.destroy", category.id));
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
