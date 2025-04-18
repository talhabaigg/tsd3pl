import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import IssueForm from "~/components/issue-form";
import { Button } from "~/components/ui/button"; // Ensure Button is imported if used
import IssueFormQR from "~/components/issue-form-guest-qr";
import { useState } from "react"; // Import useState for managing dialog state
const IssueFormModal = () => {
  const [open, setOpen] = useState(false); // state to toggle dialog

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Report new issue</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <IssueForm loggedIn={true} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default IssueFormModal;
