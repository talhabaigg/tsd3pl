import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { CalendarIcon } from "lucide-react";

interface AvatarProps {
  user?: {
    name: string;
    email?: string;
    created_at?: string; // Assuming created_at is a string in ISO format
  };
  userFullName?: string; // Optional string-only name
}

const SmallAvatar = ({ user, userFullName }: AvatarProps) => {
  // Determine the name source
  const displayName = user?.name || userFullName || "Unassigned";

  // Ensure initials are properly calculated
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // Format created_at as "Month Year"
  const joinedDate = user?.created_at
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
      }).format(new Date(user.created_at))
    : "Unknown";

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Avatar className="w-8 h-8">
          <AvatarImage src="" alt={displayName} />
          <AvatarFallback className="bg-gray-500 text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
      </HoverCardTrigger>
      <HoverCardContent className="w-full z-[1050]">
        <div className="flex justify-between space-x-4">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-gray-500 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{displayName}</h4>
            {/* Show email only if user object exists */}
            {user?.email && (
              <a className="text-xs font-light" href={`mailto:${user.email}`}>
                {user.email}
              </a>
            )}
            {user && (
              <div className="flex items-center pt-2">
                <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                <span className="text-xs text-muted-foreground">
                  Joined {joinedDate}
                </span>
              </div>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default SmallAvatar;
