import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import IssueForm from "~/components/issue-form";
import { Button } from "~/components/ui/button"; // Ensure Button is imported if used
import IssueFormQR from "~/components/issue-form-guest-qr";
const IssueFormModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Report new issue</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <IssueForm loggedIn={true}/>
      </DialogContent>
    </Dialog>
  );
};

export default IssueFormModal;
