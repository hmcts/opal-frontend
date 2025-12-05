export function calculateWeeksInFuture(weeks: number): string {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + weeks * 7);

  const day = futureDate.getDate().toString().padStart(2, '0');
  const month = (futureDate.getMonth() + 1).toString().padStart(2, '0');
  const year = futureDate.getFullYear().toString();

  return `${day}/${month}/${year}`;
}

export function calculateWeeksInPast(weeks: number): string {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() - weeks * 7);

  const day = futureDate.getDate().toString().padStart(2, '0');
  const month = (futureDate.getMonth() + 1).toString().padStart(2, '0');
  const year = futureDate.getFullYear().toString();

  return `${day}/${month}/${year}`;
}
export function formatDateString(dateString: string): string {
  const [day, month, year] = dateString.split('/');
  const date = new Date(`${year}-${month}-${day}`);
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
}
export function calculateDOB(yearsAgo: number): string {
  const today = new Date();
  const dob = new Date(today.getFullYear() - yearsAgo, today.getMonth(), today.getDate());

  const day = String(dob.getDate()).padStart(2, '0');
  const month = String(dob.getMonth() + 1).padStart(2, '0');
  const year = dob.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Converts dd/MM/yyyy → yyyy-MM-dd and accepts ISO format as-is.
 * Throws for any other format to keep assertions strict.
 */
export function parseToIsoDate(value: unknown, contextKey: string): string {
  const str = String(value).trim();

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
    const [dd, mm, yyyy] = str.split('/');
    return `${yyyy}-${mm}-${dd}`;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }

  throw new Error(`Unsupported date format for "${contextKey}": "${str}". Expected dd/MM/yyyy or yyyy-MM-dd.`);
}

export function getToday(): string {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = String(today.getFullYear());

  return `${year}-${month}-${day}`;
}
export function getDaysAgo(days: number): string {
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - days);

  const day = String(pastDate.getDate()).padStart(2, '0');
  const month = String(pastDate.getMonth() + 1).padStart(2, '0');
  const year = String(pastDate.getFullYear());

  return `${year}-${month}-${day}`;
}

export function getFirstDayOfCurrentMonth(): string {
  const today = new Date();
  const dob = new Date(today.getFullYear(), today.getMonth(), 1);

  const day = String(dob.getDate()).padStart(2, '0');
  const month = String(dob.getMonth() + 1).padStart(2, '0');
  const year = dob.getFullYear();

  return `${day}/${month}/${year}`;
}

export function getFirstDayOfPreviousMonth(): string {
  const today = new Date();
  const dob = new Date(today.getFullYear(), today.getMonth() - 1, 1);

  const day = String(dob.getDate()).padStart(2, '0');
  const month = String(dob.getMonth() + 1).padStart(2, '0');
  const year = dob.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Parses a relative weeks phrase (e.g., "9 weeks in the past") into a tuple.
 */
export function parseWeeksValue(value: string): { weeks: number; direction: 'past' | 'future' } {
  const match = value.match(/(\d+)\s+weeks?/i);
  const weeks = match ? Number(match[1]) : 0;
  const direction = /future/i.test(value) ? 'future' : 'past';
  return { weeks, direction };
}

/**
 * Resolves a relative weeks phrase into an ISO date string.
 */
export function resolveRelativeDate(value: string): string {
  const { weeks, direction } = parseWeeksValue(value);
  return direction === 'future' ? calculateWeeksInFuture(weeks) : calculateWeeksInPast(weeks);
}
