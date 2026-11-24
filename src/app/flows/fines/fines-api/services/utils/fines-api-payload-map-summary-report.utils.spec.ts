import { describe, expect, it } from 'vitest';
import { summaryResponse } from '../../fines-api-summary-report/mocks/summary-response.mock';
import { mapSummaryReport } from './fines-api-payload-map-summary-report.utils';
import { formatSummaryPence, summaryPence } from './fines-api-summary-money.utils';

describe('processed summary mapping', () => {
  it('uses fines-only acceptance, source labels and pounds without scaling twice', () => {
    const report = mapSummaryReport(summaryResponse(), new Map([['TEST', 'Test bank']]));
    expect(report.title).toBe('42');
    expect(report.fileDetails[1].value).toBe('Test bank');
    expect(report.breakdown[1]).toEqual({ label: 'Records accepted', number: 2, value: '£20.00' });
    expect(report.records[0].value).toBe('£60.00');
  });
  it.each([null, undefined])('uses file mode when till number is %s', (till_number) => {
    const report = mapSummaryReport({ ...summaryResponse(), till_number }, new Map());
    expect(report.isTill).toBe(false);
    expect(report.title).toBe('synthetic.dat');
    expect(report.sections.every((section) => section.rows.length === 0)).toBe(true);
  });
  it('preserves account identifiers, uppercases surnames and sums decimal values exactly', () => {
    const response = summaryResponse();
    response.interface_messages.push({
      message_text: 'zero_balance',
      messages: ['0.10', '0.20'].map((value, index) => ({
        interface_messages_id: index,
        message_type: 'Warning',
        message_data: { account_number: '000123', surname: 'sample', value, transaction_account: '000456' },
      })),
    });
    const section = mapSummaryReport(response, new Map()).sections[0];
    expect(section.rows[0]).toEqual(['000123', 'SAMPLE', '£0.10', '000456']);
    expect(section.total).toBe('£0.30');
  });
  it('keeps ignored and suspense error totals separate and uses the defendant account field', () => {
    const response = summaryResponse();
    response.interface_messages.push(
      ...['unknown_bank', 'invalid_transaction'].map((message_text) => ({
        message_text,
        messages: [
          {
            interface_messages_id: 10,
            message_type: 'Error' as const,
            message_data: {
              court_amount: '10.00',
              defendant_account_number: '000123',
              defendant_bank_account_number: '000999',
              Error: '<script>test</script>',
            },
          },
        ],
      })),
    );
    const report = mapSummaryReport(response, new Map());
    expect(report.ignoredTotal).toBe('£10.00');
    expect(report.errorSuspenseTotal).toBe('£10.00');
    expect(report.errors[0].defendant[2].value).toBe('000123');
  });
  it('formats enforcement balances independently of payment values', () => {
    const response = summaryResponse();
    response.interface_messages.push({
      message_text: 'enforcement_action',
      messages: [
        {
          interface_messages_id: 1,
          message_type: 'Warning',
          message_data: {
            account_number: '000123',
            surname: 'sample',
            last_action: 'TEST',
            balance: '123.45',
            value: '10.00',
            transaction_account: '000456',
          },
        },
      ],
    });
    const section = mapSummaryReport(response, new Map()).sections[1];
    expect(section.rows[0]).toEqual(['000123', 'SAMPLE', 'TEST', '£123.45', '£10.00', '000456']);
    expect(section.total).toBe('£10.00');
  });

  it.each([
    'invalid_transaction',
    'account_notfound',
    'account_written_off',
    'account_consolidated',
    'account_tfo_not_ack',
    'account_tfo_ack',
    'account_tfo_sc_ni',
  ])('includes %s in error suspense', (key) => {
    const response = summaryResponse();
    response.interface_messages.push({
      message_text: key,
      messages: [{ interface_messages_id: 1, message_type: 'Error', message_data: { court_amount: '1.25' } }],
    });
    const report = mapSummaryReport(response, new Map());
    expect(report.errors).toHaveLength(1);
    expect(report.errorSuspenseTotal).toBe('£1.25');
    expect(report.ignoredTotal).toBe('£0.00');
  });

  it('fails on missing totals instead of displaying a successful empty report', () => {
    const response = summaryResponse();
    response.interface_messages = [];
    expect(() => mapSummaryReport(response, new Map())).toThrow('Missing or duplicate');
  });
  it.each([null, undefined, '', 'abc', '1.001', {}])('rejects malformed monetary value %s', (value) => {
    expect(() => summaryPence(value)).toThrow();
  });
  it('formats zero and large exact decimal strings', () => {
    expect(formatSummaryPence(summaryPence('0'))).toBe('£0.00');
    expect(formatSummaryPence(summaryPence('999999999999.99'))).toBe('£999,999,999,999.99');
  });
});
