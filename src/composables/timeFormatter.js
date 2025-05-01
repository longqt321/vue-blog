export function formatTime(isoString) {
  const date = new Date(isoString); // parse ISO 8601

  const pad = (n) => n.toString().padStart(2, "0");

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear().toString();

  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
}
