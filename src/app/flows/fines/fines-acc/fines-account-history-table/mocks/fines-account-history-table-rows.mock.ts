import { IFinesAccountHistoryTableRow } from '../interfaces/fines-account-history-table-row.interface';
import { IFinesAccountHistoryTableRowMockOptions } from '../interfaces/fines-account-history-table-row-mock-options.interface';
import { FINES_ACCOUNT_HISTORY_TABLE_DISPLAY } from '../constants/fines-account-history-table-display.constant';

const fragment = (
  text: string,
  options: { bold?: boolean; hyphen?: boolean; link?: { type: string; emit: string } } = {},
) => ({
  text,
  bold: options.bold ?? false,
  hyphen: options.hyphen ?? false,
  ...(options.link ? { link: options.link } : {}),
});

const part = (...fragments: ReturnType<typeof fragment>[]) => ({ fragments });

const createRow = (id: string, options: IFinesAccountHistoryTableRowMockOptions): IFinesAccountHistoryTableRow => ({
  id,
  Date: options.date,
  displayDate: options.date,
  User: options.user,
  Type: options.type,
  Details: options.detailsText,
  Amount: options.amount,
  absoluteAmount: options.amount === null ? null : Math.abs(options.amount),
  amountAriaId: `${id}${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountDirectionSuffix}`,
  amountDescription:
    options.amount === null || options.amount === 0
      ? null
      : options.amount > 0
        ? FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountDescriptions.credit
        : FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountDescriptions.debit,
  amountTag:
    options.amount === null || options.amount === 0
      ? null
      : options.amount > 0
        ? FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountTags.credit
        : FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountTags.debit,
  details: options.details,
});

export const FINES_ACCOUNT_HISTORY_TABLE_ROWS_MOCK: IFinesAccountHistoryTableRow[] = [
  createRow(`${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefix}0`, {
    amount: -25,
    date: Date.parse('2025-03-12T08:30:00.123Z'),
    user: 'Case worker',
    type: 'Financial',
    detailsText: 'Payment reversed',
    details: {
      line1: [part(fragment('Payment reversed'))],
      line2: null,
    },
  }),
  createRow(`${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefix}1`, {
    amount: 50,
    date: Date.parse('2025-03-12T08:30:00.124Z'),
    user: 'Finance officer',
    type: 'Financial',
    detailsText: 'Account consolidated - 2500000BV Amount credited to master account Consolidated following review',
    details: {
      line1: [
        part(fragment('Account consolidated')),
        part(fragment('2500000BV', { bold: true, hyphen: true, link: { type: 'account', emit: '123123' } })),
        part(fragment('Amount credited to master account')),
      ],
      line2: [part(fragment('Consolidated following review'))],
    },
  }),
  createRow(`${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefix}2`, {
    amount: null,
    date: Date.parse('2024-01-01T10:00:00.000Z'),
    user: 'Notes user',
    type: 'Note',
    detailsText: 'Customer called',
    details: {
      line1: [part(fragment('Customer called'))],
      line2: null,
    },
  }),
];
