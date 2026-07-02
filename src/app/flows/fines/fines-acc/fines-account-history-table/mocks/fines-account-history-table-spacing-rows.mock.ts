import { IFinesAccountHistoryTableRow } from '../interfaces/fines-account-history-table-row.interface';
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

export const FINES_ACCOUNT_HISTORY_TABLE_SPACING_ROWS_MOCK: IFinesAccountHistoryTableRow[] = [
  {
    id: `${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefix}0`,
    Date: Date.parse('2026-06-25T08:30:00.000Z'),
    displayDate: Date.parse('2026-06-25T08:30:00.000Z'),
    User: 'Case worker',
    Type: 'Payment terms',
    Details: 'Instalments: £300.00 weekly from 25/06/2026',
    Amount: null,
    absoluteAmount: null,
    amountAriaId: `${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefix}0${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountDirectionSuffix}`,
    amountDescription: null,
    amountTag: null,
    details: {
      line1: [
        part(
          fragment('Instalments:', { bold: true }),
          fragment('£300.00'),
          fragment('weekly from'),
          fragment('25/06/2026'),
        ),
      ],
      line2: null,
    },
  },
  {
    id: `${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefix}1`,
    Date: Date.parse('2026-06-24T08:30:00.000Z'),
    displayDate: Date.parse('2026-06-24T08:30:00.000Z'),
    User: 'Case worker',
    Type: 'Enforcement',
    Details: 'FSN Warrant number: 004/25/00007',
    Amount: null,
    absoluteAmount: null,
    amountAriaId: `${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefix}1${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountDirectionSuffix}`,
    amountDescription: null,
    amountTag: null,
    details: {
      line1: [part(fragment('FSN')), part(fragment('Warrant number:', { bold: true }), fragment('004/25/00007'))],
      line2: null,
    },
  },
];
