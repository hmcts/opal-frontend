import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { IOpalFinesProcessedFileSummaryResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-processed-file-summary-response.interface';
import { IFinesApiSummaryField } from '../../fines-api-summary-report/interfaces/fines-api-summary-field.interface';
import { IFinesApiSummaryReport } from '../../fines-api-summary-report/interfaces/fines-api-summary-report.interface';
import { IFinesApiSummarySection } from '../../fines-api-summary-report/interfaces/fines-api-summary-section.interface';
import { formatSummaryPence, summaryPence } from './fines-api-summary-money.utils';

type MessageData = Record<string, unknown>;
const ERROR_KEYS = [
  'invalid_transaction',
  'account_notfound',
  'account_written_off',
  'account_consolidated',
  'account_tfo_not_ack',
  'account_tfo_ack',
  'account_tfo_sc_ni',
];
const text = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value !== 'string' && typeof value !== 'number') throw new Error('Invalid text in processing summary');
  return String(value);
};
const count = (value: unknown): number => {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) {
    throw new Error('Invalid count in processing summary');
  }
  return value;
};
const field = (label: string, value: unknown): IFinesApiSummaryField => ({ label, value: text(value) });
const errorDetails = (
  row: MessageData,
  money: (value: unknown) => string,
): IFinesApiSummaryReport['errors'][number] => ({
  court: [
    field('Sort code', row['court_sort_code']),
    field(
      'Account number/type',
      row['court_account_type']
        ? `${text(row['court_account_number'])} (${text(row['court_account_type'])})`
        : row['court_account_number'],
    ),
    field('Beneficiary name', row['court_beneficiary_name']),
    field('Transaction', row['court_transaction']),
    field('Amount', money(row['court_amount'])),
    field('Transaction account', row['court_transaction_account']),
  ],
  defendant: [
    field('Sort code', row['defendant_sort_code']),
    field('Bank account number', row['defendant_bank_account_number']),
    field('Account number', row['defendant_account_number']),
    field('Defendant name', row['defendant_name']),
    field('Error', row['Error']),
  ],
});

/**
 * Maps supplied processing outcomes and calculates display subtotals, without reclassifying payments.
 * @param response Uncached processed-file summary; all monetary response values are pounds.
 * @param sourceLabels Source code/display labels from the mappings endpoint.
 * @param utils Shared monetary formatting service.
 * @returns The shared Till/File screen model.
 */
export const mapSummaryReport = (
  response: IOpalFinesProcessedFileSummaryResponse,
  sourceLabels: ReadonlyMap<string, string>,
  utils: Pick<UtilsService, 'convertToMonetaryString'>,
): IFinesApiSummaryReport => {
  const money = (value: unknown): string => formatSummaryPence(summaryPence(value), utils);
  const sum = (rows: MessageData[], field: string): string =>
    formatSummaryPence(
      rows.reduce((total, row) => total + summaryPence(row[field]), 0n),
      utils,
    );
  const groups = new Map<string, MessageData[]>();
  for (const group of response.interface_messages) {
    groups.set(group.message_text, [
      ...(groups.get(group.message_text) ?? []),
      ...group.messages.map((message) => message.message_data),
    ]);
  }
  const rows = (key: string): MessageData[] => groups.get(key) ?? [];
  const isTill = response.till_number !== null && response.till_number !== undefined;
  const summaryRows = [
    ['Records read', 'records_read'],
    ['Records accepted', 'records_fines'],
    ['Records in suspense', 'records_suspense'],
    ['Records ignored', 'records_ignored_rejected'],
  ];
  const breakdown = summaryRows.map(([label, key]) => {
    const messages = rows(key);
    if (messages.length !== 1) throw new Error('Missing or duplicate record totals in processing summary');
    return { label, number: count(messages[0]['number']), value: money(messages[0]['value']) };
  });
  const section = (
    id: string,
    heading: string,
    columns: string[],
    data: MessageData[],
    enforcement: boolean,
  ): IFinesApiSummarySection => ({
    id,
    heading,
    columns,
    rows: data.map((row) => [
      text(row['account_number']),
      text(row['surname']).toUpperCase(),
      ...(enforcement ? [text(row['last_action']), money(row['balance'])] : []),
      money(row['value']),
      text(row['transaction_account']),
    ]),
    total: sum(data, 'value'),
  });
  const suspense = ERROR_KEYS.flatMap((key) => rows(key));
  const ignored = rows('unknown_bank');
  return {
    isTill,
    title: isTill ? text(response.till_number) : response.file_name,
    fileDetails: [
      field('File name', response.file_name),
      field('Source', sourceLabels.get(response.source.trim().toUpperCase()) ?? response.source),
      field('Business unit', response.business_unit_name),
    ],
    records: [
      field('Total amount', money(response.total_amount)),
      field('Total records', count(response.total_records)),
      field('Total errors', count(response.total_errors)),
    ],
    breakdown,
    sections: [
      section(
        'zero-balance',
        'Accounts with zero balances outstanding',
        ['Account number', 'Surname', 'Value', 'Transaction account'],
        rows('zero_balance'),
        false,
      ),
      section(
        'enforcement',
        'Accounts with selected enforcement actions',
        ['Account number', 'Surname', 'Last action', 'Balance', 'Value', 'Transaction account'],
        rows('enforcement_action'),
        true,
      ),
    ],
    errors: response.interface_messages
      .filter((group) => [...ERROR_KEYS, 'unknown_bank'].includes(group.message_text))
      .flatMap((group) => group.messages.map((message) => errorDetails(message.message_data, money))),
    errorSuspenseTotal: sum(suspense, 'court_amount'),
    ignoredTotal: sum(ignored, 'court_amount'),
  };
};
