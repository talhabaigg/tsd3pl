import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import SmallAvatar from "~/components/user-avatar-small";
import ColoredBadge from "~/components/colored-badge";
import DateTimeFormatted from "./date-time-formatted";

interface IssueActivityBoxProps {
  issueId?: number;
  existingActivities: any[];
  commentClickHandler?: (id: number) => void;
}

const isJson = (value: string) => {
  try {
    JSON.parse(value);
    return true;
  } catch (e) {
    return false;
  }
};

const formatJson = (json: string) => {
  try {
    const parsed = JSON.parse(json);
    return JSON.stringify(parsed, null, 2); // pretty print with 2 spaces of indentation
  } catch (e) {
    return json; // If it's not valid JSON, just return the raw value
  }
};

const IssueActivityBox: React.FC<IssueActivityBoxProps> = ({
  issueId,
  commentClickHandler,
  existingActivities,
}) => {
  const [activity, setActivity] = useState(existingActivities);
  const handleCommentClick = (id: number) => {
    console.log("Comment clicked:", id);
    if (commentClickHandler) {
      commentClickHandler(id); // Call the handler if provided
    }
  };
  return (
    <div className="space-y-2  ">
      {activity.length === 0 ? (
        <p className="text-center text-gray-500">No activity found.</p>
      ) : (
        activity.map((act, index) => (
          <div
            key={index}
            onClick={() => handleCommentClick(act.issue.id)}
            className="flex flex-wrap space-x-2 items-center sm:space-x-4 border p-2 rounded  my-2 dark:hover:bg-gray-900 hover:bg-gray-100 cursor-pointer"
          >
            <SmallAvatar userFullName={act.user.name} />

            <div>
              <div className="flex ">
                {act.action !== "created" && (
                  <>
                    {act.old_value?.length <= 10 ? (
                      <ColoredBadge value={act.old_value} />
                    ) : (
                      <p className="text-sm text-gray-500">
                        Value is too long to display
                      </p>
                    )}
                  </>
                )}

                {act.action === "created" ? "" : <ArrowRight />}

                {!isJson(act.new_value) ? (
                  <>
                    {act.new_value.length <= 10 ? (
                      <ColoredBadge value={act.new_value} />
                    ) : (
                      <p className="wrap text-sm text-gray-500">
                        {act.new_value}
                      </p>
                    )}
                  </>
                ) : (
                  <pre className="p-1 rounded-lg text-wrap text-xs ">
                    {formatJson(act.new_value)}
                  </pre>
                )}
              </div>
              <div className="text-xs" title={"Issue ID: " + act.issue?.id}>
                {" "}
                <span className="">{act.action} </span>
                <DateTimeFormatted date={act.created_at} />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default IssueActivityBox;
