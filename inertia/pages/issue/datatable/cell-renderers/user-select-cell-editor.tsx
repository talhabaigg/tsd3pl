import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import ExtendedAvatar from "~/components/user-avatar-extended";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
// import { Avatar } from "./ui/avatar";

// Combobox Editor Component
interface ComboboxEditorProps {
  value: string | null;
  onValueChange: (value: string | null) => void;
}

export function ComboboxEditor({ value, onValueChange }: ComboboxEditorProps) {
  const [open, setOpen] = React.useState(false);
  const [users, setUsers] = React.useState<{ value: string; label: string }[]>(
    [],
  );

  React.useEffect(() => {
    fetch(route("users.getUsers"))
      .then((response) => response.json()) // Parse the JSON response
      .then((data) => {
        const transformedUsers = data.users.map((user: any) => ({
          value: user.id.toString(),
          label: user.name,
        }));
        setUsers(transformedUsers);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // Empty dependency array means this effect runs once on mount
  const handleSelect = (selectedValue: string) => {
    // When a selection is made, update the value and close the dropdown
    onValueChange(selectedValue === value ? null : selectedValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value && value !== ""
            ? users.find((user) => user.value === value)?.label ||
              "Select user..."
            : "Select user..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search user..." className="h-9" />
          <CommandList>
            <CommandEmpty>No user found.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.value}
                  value={user.label}
                  onSelect={() => handleSelect(user.value)}
                  className="flex items-center space-x-2 " // Added spacing for avatar and label
                >
                  {/* Avatar */}
                  <ExtendedAvatar userFullName={user.label} />

                  <Check
                    className={cn(
                      "ml-auto",
                      value === user.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
