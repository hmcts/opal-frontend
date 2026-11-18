import { describe, expect, it } from 'vitest';
import { compareCourtFeeAmounts, comparePayment, formatPounds } from './fines-mci-court-fee-payment.utils';

describe('court fee payment utilities', () => {
  const fee = { court_fee_id: 1, court_fee_code: 'CF001', description: 'Application', amount: 12.5 };

  it.each([
    ['25.00', 12.5, '2', 0n],
    ['25.000', 12.5, '2', 0n],
    ['25.001', 12.5, '2', 1n],
    ['24.99', 12.5, '2', -1n],
    [' 0.30 ', 0.1, ' 3 ', 0n],
    ['9007199254740993.01', 0.01, '1', 900719925474099300n],
  ])('compares £%s against £%s for %s items exactly', (amount, feeAmount, items, difference) => {
    expect(compareCourtFeeAmounts(amount, feeAmount, items)?.difference).toBe(difference);
  });

  it.each([
    ['', '1'],
    ['12x', '1'],
    ['12.5.0', '1'],
    ['12.50', ''],
    ['12.50', '1.5'],
    ['12.50', '0'],
  ])('rejects invalid amount %s or number of items %s', (amount, items) => {
    expect(compareCourtFeeAmounts(amount, fee.amount, items)).toBeNull();
  });

  it.each([
    [0n, 2, '£0.00'],
    [1030001n, 3, '£1,030.001'],
    [1030000n, 3, '£1,030.00'],
    [900719925474099310n, 2, '£9,007,199,254,740,993.10'],
  ])('formats %s at scale %s as %s', (amount, decimalPlaces, expected) => {
    expect(formatPounds(amount, decimalPlaces)).toBe(expected);
  });

  it.each([
    ['25.001', 'information', 'This amount contains a £0.001 overpayment.'],
    ['24.99', 'warning', 'This amount contains a £0.01 underpayment.'],
  ])('builds the correct confirmation for £%s', (amount, type, message) => {
    const result = comparePayment({ courtFeeId: 1, amountPaid: amount, numberOfItems: '2' }, fee);

    expect(result).toMatchObject({ type, message, courtFee: 'CF001 – Application (£12.50)', numberOfItems: '2' });
  });

  it.each([
    { courtFeeId: 1, amountPaid: '25.00', numberOfItems: '2' },
    { courtFeeId: 1, amountPaid: null, numberOfItems: '2' },
    { courtFeeId: 1, amountPaid: '25', numberOfItems: null },
    { courtFeeId: 1, amountPaid: '25', numberOfItems: '0' },
  ])('does not create confirmation details for an exact or invalid payment', (draft) => {
    expect(comparePayment(draft, fee)).toBeNull();
  });
});
