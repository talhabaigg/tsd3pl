// src/components/Breadcrumbs.tsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Link } from "@inertiajs/react";

interface BreadcrumbProps {
  label: string;
  route: string;
  isActive: boolean;
}

interface BreadcrumbsProps {
  breadcrumbs: BreadcrumbProps[];
}

export function Breadcrumbs({ breadcrumbs }: BreadcrumbsProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => (
          <BreadcrumbItem key={index}>
            {breadcrumb.isActive ? (
              <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink>
                <Link href={route(breadcrumb.route)}>{breadcrumb.label}</Link>
              </BreadcrumbLink>
            )}
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
