/**
 * Converts API pounds to integer pence without binary floating-point addition or rounding invalid data.
 * @param value A decimal pounds value from the API.
 * @returns Exact pence, including amounts outside Number's safe integer range when supplied as strings.
 */
export const summaryPence = (value: unknown): bigint => {
  if (typeof value !== 'number' && typeof value !== 'string') {
    throw new Error('Invalid monetary value in processing summary');
  }
  const match = /^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(String(value));
  if (!match || (typeof value === 'number' && Math.abs(value) > Number.MAX_SAFE_INTEGER / 100)) {
    throw new Error('Invalid monetary value in processing summary');
  }
  const pence = BigInt(match[2]) * 100n + BigInt((match[3] ?? '').padEnd(2, '0'));
  return match[1] ? -pence : pence;
};

/**
 * Formats exact pence as a pounds sterling display value.
 * @param pence Integer pence.
 * @returns A GBP amount with grouping and two decimal places.
 */
export const formatSummaryPence = (pence: bigint): string => {
  const absolute = pence < 0n ? -pence : pence;
  return `${pence < 0n ? '-' : ''}£${(absolute / 100n).toLocaleString('en-GB')}.${String(absolute % 100n).padStart(2, '0')}`;
};
