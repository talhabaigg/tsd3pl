import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import SmallAvatar from "./user-avatar-small";
interface ExtendedAvatarProps {
  userFullName?: string; // Make userFullName optional
}

const ExtendedAvatar = ({
  userFullName = "Unassigned",
}: ExtendedAvatarProps) => {
  // Calculate initials only when userFullName is provided
  const initials = userFullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center">
      <SmallAvatar userFullName={userFullName} />
      <span className="ml-2">{userFullName}</span>
    </div>
  );
};

export default ExtendedAvatar;
