import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { IOpalFinesAlternatePaymentReference } from '@services/fines/opal-fines-service/interfaces/opal-fines-alternate-payment-reference.interface';
import { FinesAccAlternatePaymentReferenceTableComponent } from './fines-acc-alternate-payment-reference-table.component';

const currentReference: IOpalFinesAlternatePaymentReference = {
  alternate_payment_reference_id: 11,
  defendant_account_id: 141,
  business_unit_id: 77,
  relationship: 'APR',
  category: 'APR',
  apr_text: 'CURRENT-REFERENCE',
  created_at: '2026-06-01T12:00:00Z',
  updated_at: null,
};

describe('FinesAccAlternatePaymentReferenceTableComponent', () => {
  let fixture: ComponentFixture<FinesAccAlternatePaymentReferenceTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccAlternatePaymentReferenceTableComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccAlternatePaymentReferenceTableComponent);
    fixture.componentRef.setInput('tableId', 'references');
    fixture.componentRef.setInput('references', [currentReference]);
  });

  it('renders references in the supplied order with scoped table headings and missing updated dates', () => {
    fixture.componentRef.setInput('references', [
      { ...currentReference, alternate_payment_reference_id: 12, apr_text: 'Z-REFERENCE' },
      { ...currentReference, alternate_payment_reference_id: 11, apr_text: 'A-REFERENCE' },
    ]);
    fixture.detectChanges();

    const table = fixture.nativeElement.querySelector('#references') as HTMLTableElement;
    expect(Array.from(table.querySelectorAll('thead th')).map((cell) => cell.textContent?.trim())).toEqual([
      'Reference',
      'Date created',
      'Date updated',
      'Actions',
    ]);
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    expect(rows.map((row) => row.getAttribute('data-reference-id'))).toEqual(['12', '11']);
    expect(rows.map((row) => row.querySelector('th[scope="row"]')?.textContent?.trim())).toEqual([
      'Z-REFERENCE',
      'A-REFERENCE',
    ]);
    expect(rows[0].querySelectorAll('td')[1].textContent?.trim()).toBe('—');
    expect(table.querySelectorAll('thead th[scope="col"]')).toHaveLength(4);
  });

  it('gives direct references change and remove links with selected IDs and accessible reference context', () => {
    fixture.detectChanges();

    const change = fixture.nativeElement.querySelector('#apr-change-11') as HTMLAnchorElement;
    const remove = fixture.nativeElement.querySelector('#apr-remove-11') as HTMLAnchorElement;
    expect(change.getAttribute('href')).toBe('/edit?alternatePaymentReferenceId=11');
    expect(remove.getAttribute('href')).toBe('/delete?alternatePaymentReferenceId=11');
    expect(change.querySelector('.govuk-visually-hidden')?.textContent?.trim()).toBe('CURRENT-REFERENCE');
    expect(remove.querySelector('.govuk-visually-hidden')?.textContent?.trim()).toBe('CURRENT-REFERENCE');
  });

  it.each(['CONSOLIDATED', 'AMALGAMATED'] as const)(
    'offers removal without change for a user-entered %s reference',
    (relationship) => {
      fixture.componentRef.setInput('references', [{ ...currentReference, relationship }]);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('#apr-change-11')).toBeNull();
      expect(fixture.nativeElement.querySelector('#apr-remove-11')).not.toBeNull();
    },
  );

  it('omits the actions column and links when used for a confirmation table', () => {
    fixture.componentRef.setInput('showActions', false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('thead th')).toHaveLength(3);
    expect(fixture.nativeElement.querySelectorAll('tbody td')).toHaveLength(2);
    expect(fixture.nativeElement.querySelector('a')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('CURRENT-REFERENCE');
  });
});
