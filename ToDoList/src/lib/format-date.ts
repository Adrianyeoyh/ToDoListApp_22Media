const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

export function parseApiTimestamp(timestamp: string): Date {
  const isoTimestamp = timestamp.replace(' ', 'T');
  const hasTimezone = /([zZ]|[+-]\d{2}:?\d{2})$/.test(isoTimestamp);

  return new Date(hasTimezone ? isoTimestamp : `${isoTimestamp}Z`);
}

export function formatDateTime(date: Date): string {
  const hours = date.getHours();
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const period = hours < 12 ? 'am' : 'pm';

  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()} ${displayHour}:${minutes}${period}`;
}
