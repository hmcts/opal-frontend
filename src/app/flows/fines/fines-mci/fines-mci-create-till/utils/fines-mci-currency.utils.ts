/** Formats a pound amount without converting its decimal digits to a floating-point number. */
export function formatPoundsFromDecimal(amount: string | null | undefined): string {
  const parts = /^(-?)(0|[1-9]\d*)(?:\.(\d{0,2}))?$/.exec(amount ?? '');
  if (!parts) return '—';

  const [, sign, pounds, pence = ''] = parts;
  return `${sign}£${BigInt(pounds).toLocaleString('en-GB')}.${pence.padEnd(2, '0')}`;
}
