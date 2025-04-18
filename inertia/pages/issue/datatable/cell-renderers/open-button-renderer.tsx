import { Link } from "@inertiajs/react";

const OpenButtonRenderer = ({ data }: any) => (
  <Link
    href={route("issue.show", data.id)} // Link to the issue details page
    className="btn btn-secondary bg-secondary text-black dark:text-gray-100 rounded-md p-2 w-full  "
  >
    Open
  </Link>
);

export default OpenButtonRenderer;
