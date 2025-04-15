import React from 'react';

const DueDateCellRenderer = ({ value }: { value: string | number | Date }) => {
  const date = new Date(value);

  // Get the current date
  const currentDate = new Date();
  
  // Get the date 7 days in the future
  const futureDate = new Date();
  futureDate.setDate(currentDate.getDate() + 7);

  // Check if the due date is in the future (+7 days) or past due
  let bgColor = ''; // Default no color

  if (date <= currentDate) {
    bgColor = 'font-bold text-red-500'; // Past due (red)
  } else if (date <= futureDate) {
    bgColor = 'font-bold text-yellow-500'; // Due within 7 days (yellow)
  }

  // Format the date and time
  const formattedDateTime = new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",        // 24-hour format
    minute: "2-digit",      // 2 digits for minutes
    second: "2-digit",      // 2 digits for seconds
    hour12: false,          // 24-hour clock, set true for 12-hour clock
  }).format(date);

  // Split the formatted string for further customization
  const [day, month, year, hour, minute] = formattedDateTime.split(/[\s,:]+/);

  // Return formatted date and time with the conditional background color
  return (
    <div className={` ${bgColor}`}>
      {`${day}-${month}-${year}`}
    </div>
  );
};

export default DueDateCellRenderer;
