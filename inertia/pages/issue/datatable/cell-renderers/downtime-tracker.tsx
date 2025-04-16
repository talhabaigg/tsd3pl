import React, { useEffect, useState } from "react";
import { Play, CircleStop, ClockArrowDown } from "lucide-react";
import axios from "axios";

const formatDuration = (milliseconds: number) => {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":");
};

const DownTimeTracker = ({ value, data }: { value: string | null, data: any }) => {
  const [elapsed, setElapsed] = useState("00:00:00");
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const issueId = data.id;

  const downtimeEnded = !!data.downtime_start_time && !!data.downtime_end_time;

  const handleToggleDowntime = async () => {
    if (downtimeEnded) return;

    try {
      const res = await axios.put(`/issues/${issueId}/start-downtime`);
      const updatedIssue = res.data.data;

      if (updatedIssue.downtime_start_time && !updatedIssue.downtime_end_time) {
        setIsRunning(true);
        setStartTime(new Date(updatedIssue.downtime_start_time).getTime());
      } else {
        setIsRunning(false);
        setStartTime(null);

        if (updatedIssue.downtime_start_time && updatedIssue.downtime_end_time) {
          const diff = new Date(updatedIssue.downtime_end_time).getTime() -
                       new Date(updatedIssue.downtime_start_time).getTime();
          setElapsed(formatDuration(diff));
        }
      }
    } catch (error) {
      console.error("Failed to toggle downtime:", error);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (downtimeEnded) {
      const diff =
        new Date(data.downtime_end_time).getTime() -
        new Date(data.downtime_start_time).getTime();
      setElapsed(formatDuration(diff));
      setIsRunning(false);
    } else if (value) {
      const parsedStart = new Date(value).getTime();
      setStartTime(parsedStart);
      setIsRunning(true);
    }

    if (isRunning && startTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const diff = now - startTime!;
        setElapsed(formatDuration(diff));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, startTime, value, downtimeEnded]);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggleDowntime}
        disabled={downtimeEnded}
        className={`disabled:opacity-50 ${
          isRunning ? "text-red-600" : "text-green-600"
        }`}
      >
        {downtimeEnded ? (
          <ClockArrowDown />
        ) : isRunning ? (
          <CircleStop />
        ) : (
          <Play />
        )}
      </button>
      <span>{elapsed}</span>
    </div>
  );
};

export default DownTimeTracker;
