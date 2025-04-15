import React from "react";

interface DateTimeFormatted {
  date: string | Date; // Accepts a string or Date object
}
// date looks like 12th January 2022 at 12:00 PM
const DateTimeFormatted: React.FC<DateTimeFormatted> = ({ date }) => {
  const formattedDate = new Date(date)
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", "");

  return <span>{formattedDate}</span>;
};

export default DateTimeFormatted;
