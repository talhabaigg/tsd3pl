import { useForm } from "@inertiajs/react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { InputFile } from "./file-input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"; // Import from ShadCN
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox"; // Assuming Checkbox is from ShadCN
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Issue {
  id: number;
  type: string;
  title: string;
  priority: string;
  description: string;
  file: string;
}
interface IssueFormProps {
  issue: Issue | null;
  loggedIn: boolean; // Add this prop to indicate if the user is logged in
  onSuccess?: () => void; // <-- add this prop
}
const IssueForm = ({ issue, loggedIn, onSuccess }: IssueFormProps) => {
  // Determine if the form is in "edit" or "create" mode
  const isEditing = !!issue;

  const { data, setData, post, put, processing, errors } = useForm({
    id: isEditing ? issue.id : null,
    type: isEditing ? issue.type : "", // Pre-fill with issue data if editing
    name: isEditing ? issue.title : "",
    priority: isEditing ? issue.priority : "",
    description: isEditing ? issue.description : "",
    file: isEditing ? issue.file : "", // No pre-filled attachments for editing (can handle as needed)
    fullName: "",
    email: "",
  });

  const [issueTypes, setIssueTypes] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    const fetchIssueTypes = async () => {
      try {
        const response = await fetch(route("issue-categories.retrieve"));
        const data = await response.json();

        // Assuming API returns: [{ id, name }]
        const formatted = data.map((cat: { id: number; name: string }) => ({
          value: cat.name,
          label: cat.name,
        }));

        setIssueTypes(formatted);
      } catch (error) {
        console.error("Failed to load issue types:", error);
      }
    };

    fetchIssueTypes();
  }, []);

  const priorityOptions = [
    { value: "critical", label: "Critical" },
    { value: "normal", label: "Normal" },
  ];

  // State to track whether the checkbox is checked
  const [isChecked, setIsChecked] = useState(false);

  const handleFileChange = (e) => {
    setData("file", e.target.files[0]);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!isChecked) {
      alert("You must confirm the checkbox before submitting.");
      return;
    }
    post(route("issue.store"));
    onSuccess?.();
    // toast.success("Issue has been submitted.");

    // Use PUT for editing, POST for creating
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked); // Update the checkbox state
  };

  return (
    <form onSubmit={submit} className="space-y-4 ">
      {/* Issue Type */}

      <div>
        <Label htmlFor="type">Issue Type</Label>
        <Select
          value={data.type} // Controlled value bound to form state
          onValueChange={(value) => setData("type", value)} // Update state when value changes
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an issue type" />
          </SelectTrigger>
          <SelectContent>
            {issueTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.type && <div className="text-red-600">{errors.type}</div>}
      </div>

      {/* Issue Name */}
      <div>
        <Label htmlFor="name">Issue Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter issue name"
          value={data.name}
          onChange={(e) => setData("name", e.target.value.slice(0, 50))}
          maxLength={50}
          required
        />
        <div className="text-xs text-right text-gray-500 mt-1">
          {data.name.length}/50 characters
        </div>
        {errors.name && <div className="text-red-600">{errors.name}</div>}
      </div>

      {/* Priority */}
      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select
          value={data.priority}
          onValueChange={(value) => setData("priority", value)} // Controlled value
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            {priorityOptions.map((priority) => (
              <SelectItem key={priority.value} value={priority.value}>
                {priority.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.priority && (
          <div className="text-red-600">{errors.priority}</div>
        )}
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => setData("description", e.target.value)}
        />
        {errors.description && (
          <div className="text-red-600">{errors.description}</div>
        )}
      </div>

      {/* Evidence */}
      <div>
        <InputFile
          label="Upload file"
          id="attachments"
          onChange={handleFileChange}
        />
        {errors.file && <div className="text-red-600">{errors.file}</div>}
      </div>
      {/* Display Full Name and Email if not logged in */}
      {!loggedIn && (
        <>
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={data.fullName}
              onChange={(e) => setData("fullName", e.target.value)}
              required
            />
            {errors.fullName && (
              <div className="text-red-600">{errors.fullName}</div>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
              required
            />
            {errors.email && <div className="text-red-600">{errors.email}</div>}
          </div>
        </>
      )}
      {/* Checkbox for confirmation */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="terms"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <Label htmlFor="terms">Confirm submitting the issue to TSD ROQ</Label>
      </div>

      {/* Submit Button */}
      <div>
        <Button type="submit" disabled={processing || !isChecked}>
          {processing ? "Submitting..." : isEditing ? "Update Issue" : "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default IssueForm;
