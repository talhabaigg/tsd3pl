import { Badge } from "~/components/ui/badge";

// Combobox Editor Component
export default function ColoredBadge({ value }: { value: string }) {
  const normalizedValue = value.toLowerCase();
  const displayLabel =
    normalizedValue.charAt(0).toUpperCase() + normalizedValue.slice(1);

  return <Badge>{displayLabel}</Badge>;
}
