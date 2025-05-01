export function formatTime(isoString) {
  const date = new Date(isoString); // parse ISO 8601

  const pad = (n) => n.toString().padStart(2, "0");

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear().toString();

  return `${hours}:${minutes} ${day}/${month}/${year}`;
}
