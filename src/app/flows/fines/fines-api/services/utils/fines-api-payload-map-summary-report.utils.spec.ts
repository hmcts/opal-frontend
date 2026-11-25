import { TestBed } from '@angular/core/testing';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { describe, expect, it } from 'vitest';
import { summaryResponse } from '../../fines-api-summary-report/mocks/summary-response.mock';
import { mapSummaryReport } from './fines-api-payload-map-summary-report.utils';

describe('processed summary mapping', () => {
  it('uses fines-only acceptance, source labels and pounds without scaling twice', () => {
    const report = mapSummaryReport(summaryResponse(), new Map([['TEST', 'Test bank']]), TestBed.inject(UtilsService));
    expect(report.title).toBe('42');
    expect(report.fileDetails[1].value).toBe('Test bank');
    expect(report.breakdown[1]).toEqual({ label: 'Records accepted', number: 2, value: '£20.00' });
    expect(report.records[0].value).toBe('£60.00');
  });
  it.each([null, undefined])('uses file mode when till number is %s', (till_number) => {
    const report = mapSummaryReport({ ...summaryResponse(), till_number }, new Map(), TestBed.inject(UtilsService));
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
    const section = mapSummaryReport(response, new Map(), TestBed.inject(UtilsService)).sections[0];
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
    const report = mapSummaryReport(response, new Map(), TestBed.inject(UtilsService));
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
    const section = mapSummaryReport(response, new Map(), TestBed.inject(UtilsService)).sections[1];
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
    const report = mapSummaryReport(response, new Map(), TestBed.inject(UtilsService));
    expect(report.errors).toHaveLength(1);
    expect(report.errorSuspenseTotal).toBe('£1.25');
    expect(report.ignoredTotal).toBe('£0.00');
  });

  it('fails on missing totals instead of displaying a successful empty report', () => {
    const response = summaryResponse();
    response.interface_messages = [];
    expect(() => mapSummaryReport(response, new Map(), TestBed.inject(UtilsService))).toThrow('Missing or duplicate');
  });
});

describe('summary response validation and grouping', () => {
  const map = (response = summaryResponse()) => mapSummaryReport(response, new Map(), TestBed.inject(UtilsService));
  it.each([-1, 1.5, '2', null, Number.MAX_SAFE_INTEGER + 1])('rejects invalid record count %s', (number) => {
    const response = summaryResponse();
    response.interface_messages[0].messages[0].message_data['number'] = number;
    expect(() => map(response)).toThrow('Invalid count');
  });
  it('rejects invalid text instead of displaying an object', () => {
    const response = summaryResponse();
    response.interface_messages.push({
      message_text: 'zero_balance',
      messages: [
        { interface_messages_id: 90, message_type: 'Warning', message_data: { account_number: {}, value: 10 } },
      ],
    });
    expect(() => map(response)).toThrow('Invalid text');
  });
  it('combines repeated detail groups and preserves their row order', () => {
    const response = summaryResponse();
    for (const account of ['001', '002']) {
      response.interface_messages.push({
        message_text: 'zero_balance',
        messages: [
          {
            interface_messages_id: 90,
            message_type: 'Warning',
            message_data: { account_number: account, surname: '', value: '0.10', transaction_account: null },
          },
        ],
      });
    }
    const section = map(response).sections[0];
    expect(section.rows).toEqual([
      ['001', '—', '£0.10', '—'],
      ['002', '—', '£0.10', '—'],
    ]);
    expect(section.total).toBe('£0.20');
  });
  it('rejects duplicate summary totals', () => {
    const response = summaryResponse();
    response.interface_messages.push(response.interface_messages[0]);
    expect(() => map(response)).toThrow('Missing or duplicate record totals');
  });
  it('maps all court and defendant fields, including the optional account type', () => {
    const response = summaryResponse();
    response.interface_messages.push({
      message_text: 'invalid_transaction',
      messages: [
        {
          interface_messages_id: 90,
          message_type: 'Error',
          message_data: {
            court_sort_code: '000001',
            court_account_number: '000002',
            court_account_type: 'TEST',
            court_beneficiary_name: 'Synthetic court',
            court_transaction: 'TEST',
            court_amount: 10,
            court_transaction_account: '000003',
            defendant_sort_code: '000004',
            defendant_bank_account_number: '000005',
            defendant_account_number: '000006',
            defendant_name: 'Synthetic person',
            Error: 'Synthetic error',
          },
        },
      ],
    });
    const error = map(response).errors[0];
    expect(error.court.map((field) => field.value)).toEqual([
      '000001',
      '000002 (TEST)',
      'Synthetic court',
      'TEST',
      '£10.00',
      '000003',
    ]);
    expect(error.defendant.map((field) => field.value)).toEqual([
      '000004',
      '000005',
      '000006',
      'Synthetic person',
      'Synthetic error',
    ]);
  });
  it('ignores unknown message categories and preserves an unmapped source code', () => {
    const response = summaryResponse();
    response.interface_messages.push({
      message_text: 'Till allocated: 42',
      messages: [{ interface_messages_id: 90, message_type: 'Info', message_data: {} }],
    });
    const report = map(response);
    expect(report.errors).toEqual([]);
    expect(report.fileDetails[1].value).toBe(response.source);
    expect(report.breakdown).toHaveLength(4);
  });
});
