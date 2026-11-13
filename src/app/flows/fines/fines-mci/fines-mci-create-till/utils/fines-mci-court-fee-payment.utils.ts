import { IOpalFinesCourtFee } from '@services/fines/opal-fines-service/interfaces/opal-fines-court-fees.interface';
import { IFinesMciCourtFeeDraft } from '../../stores/interfaces/fines-mci.interface';
import { IFinesMciCourtFeeAmountComparison } from '../interfaces/fines-mci-court-fee-amount-comparison.interface';
import { ICourtFeePaymentComparison } from '../interfaces/fines-mci-court-fee-payment-comparison.interface';

/** Formats money without rounding sub-penny values or converting large integers to numbers. */
export function formatPounds(amount: bigint, decimalPlaces: number): string {
  const scale = 10n ** BigInt(decimalPlaces);
  const pounds = amount / scale;
  const pence = (amount % scale).toString().padStart(decimalPlaces, '0').replace(/0+$/, '').padEnd(2, '0');
  return `£${pounds.toLocaleString('en-GB')}.${pence}`;
}

/** Compares the paid amount and fee total at the entered decimal scale. */
export function compareCourtFeeAmounts(
  amount: string,
  feeAmount: number,
  numberOfItems: string,
): IFinesMciCourtFeeAmountComparison | null {
  const trimmedAmount = amount.trim();
  const trimmedItems = numberOfItems.trim();
  if (!/^\d+(?:\.\d+)?$/.test(trimmedAmount) || !/^\d+$/.test(trimmedItems)) return null;

  const items = BigInt(trimmedItems);
  if (items === 0n) return null;

  const [wholePounds, fraction = ''] = trimmedAmount.split('.');
  const decimalPlaces = Math.max(2, fraction.length);
  const scale = 10n ** BigInt(decimalPlaces);
  const paid = BigInt(wholePounds) * scale + BigInt(fraction.padEnd(decimalPlaces, '0'));
  const expected = BigInt(Math.round(feeAmount * 100)) * items * (scale / 100n);
  return { paid, difference: paid - expected, decimalPlaces };
}

/** Builds the confirmation details for an overpayment or underpayment. */
export function comparePayment(
  draft: IFinesMciCourtFeeDraft,
  fee: IOpalFinesCourtFee,
): ICourtFeePaymentComparison | null {
  const amount = draft.amountPaid?.trim();
  const numberOfItems = draft.numberOfItems?.trim();
  if (!amount || !numberOfItems) return null;

  const comparison = compareCourtFeeAmounts(amount, fee.amount, numberOfItems);
  if (!comparison || comparison.difference === 0n) return null;

  const { paid, difference, decimalPlaces } = comparison;
  const overpayment = difference > 0n;
  const differenceAmount = formatPounds(overpayment ? difference : -difference, decimalPlaces);
  return {
    type: overpayment ? 'information' : 'warning',
    heading: overpayment ? 'Confirm overpayment' : 'You cannot add an underpayment',
    message: `This amount contains a ${differenceAmount} ${overpayment ? 'overpayment' : 'underpayment'}.`,
    courtFee: `${fee.court_fee_code} – ${fee.description} (${formatPounds(BigInt(Math.round(fee.amount * 100)), 2)})`,
    amount: formatPounds(paid, decimalPlaces),
    numberOfItems,
  };
}
