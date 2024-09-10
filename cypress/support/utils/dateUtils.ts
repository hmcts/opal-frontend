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
