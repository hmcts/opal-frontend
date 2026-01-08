/**
 * Calculate a date N weeks in the future formatted as dd/MM/yyyy.
 * @param weeks Number of weeks to add to today.
 * @returns Future date string in dd/MM/yyyy format.
 */
export function calculateWeeksInFuture(weeks: number): string {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + weeks * 7);

  const day = futureDate.getDate().toString().padStart(2, '0');
  const month = (futureDate.getMonth() + 1).toString().padStart(2, '0');
  const year = futureDate.getFullYear().toString();

  return `${day}/${month}/${year}`;
}

/**
 * Calculate a date N weeks in the past formatted as dd/MM/yyyy.
 * @param weeks Number of weeks to subtract from today.
 * @returns Past date string in dd/MM/yyyy format.
 */
export function calculateWeeksInPast(weeks: number): string {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() - weeks * 7);

  const day = futureDate.getDate().toString().padStart(2, '0');
  const month = (futureDate.getMonth() + 1).toString().padStart(2, '0');
  const year = futureDate.getFullYear().toString();

  return `${day}/${month}/${year}`;
}
/**
 * Format a dd/MM/yyyy string into a long-form UK date (e.g., 01 January 2024).
 * @param dateString Date string in dd/MM/yyyy format.
 * @returns Human-readable date in en-GB locale.
 */
export function formatDateString(dateString: string): string {
  const [day, month, year] = dateString.split('/');
  const date = new Date(`${year}-${month}-${day}`);
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
}
/**
 * Calculate a DOB string for someone N years ago.
 * @param yearsAgo Number of years in the past.
 * @returns DOB in dd/MM/yyyy format.
 */
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
 * @param value Input date value to convert.
 * @param contextKey Context key to improve error reporting.
 * @returns ISO 8601 date string.
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

/**
 * Get today's date as yyyy-MM-dd.
 * @returns ISO date string for today.
 */
export function getToday(): string {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = String(today.getFullYear());

  return `${year}-${month}-${day}`;
}
/**
 * Get the date N days ago as yyyy-MM-dd.
 * @param days Number of days to subtract.
 * @returns ISO date string for the past date.
 */
export function getDaysAgo(days: number): string {
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - days);

  const day = String(pastDate.getDate()).padStart(2, '0');
  const month = String(pastDate.getMonth() + 1).padStart(2, '0');
  const year = String(pastDate.getFullYear());

  return `${year}-${month}-${day}`;
}

/**
 * First day of the current month in dd/MM/yyyy format.
 * @returns Date string for the first day of this month.
 */
export function getFirstDayOfCurrentMonth(): string {
  const today = new Date();
  const dob = new Date(today.getFullYear(), today.getMonth(), 1);

  const day = String(dob.getDate()).padStart(2, '0');
  const month = String(dob.getMonth() + 1).padStart(2, '0');
  const year = dob.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * First day of the previous month in dd/MM/yyyy format.
 * @returns Date string for the first day of last month.
 */
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
 * @param value Phrase describing relative weeks (past/future).
 * @returns Parsed weeks count and direction.
 */
export function parseWeeksValue(value: string): { weeks: number; direction: 'past' | 'future' } {
  const match = value.match(/(\d+)\s+weeks?/i);
  const weeks = match ? Number(match[1]) : 0;
  const direction = /future/i.test(value) ? 'future' : 'past';
  return { weeks, direction };
}

/**
 * Resolves a relative weeks phrase into an ISO date string.
 * @param value Phrase describing relative weeks (past/future).
 * @returns Date string resolved from the relative phrase.
 */
export function resolveRelativeDate(value: string): string {
  const { weeks, direction } = parseWeeksValue(value);
  return direction === 'future' ? calculateWeeksInFuture(weeks) : calculateWeeksInPast(weeks);
}
