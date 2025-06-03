export function formatTime(timeData) {
  let date;

  // Handle array format: [year, month, day, hour, minute, second, nanoseconds]
  if (Array.isArray(timeData)) {
    const [year, month, day, hour, minute, second] = timeData;
    // Note: month in array is 1-based, but Date constructor expects 0-based month
    date = new Date(year, month - 1, day, hour, minute, second);
  } else {
    // Handle ISO string format for backward compatibility
    date = new Date(timeData);
  }

  const pad = (n) => n.toString().padStart(2, "0");

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear().toString();

  return `${hours}:${minutes} ${day}/${month}/${year}`;
}
