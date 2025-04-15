const CreatedAtCellRenderer = ({ value }: { value: string | number | Date }) => {
  const date = new Date(value);

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

  // Return formatted date and time
  return `${hour}:${minute} ${day}-${month}-${year} `;
};

export default CreatedAtCellRenderer;
