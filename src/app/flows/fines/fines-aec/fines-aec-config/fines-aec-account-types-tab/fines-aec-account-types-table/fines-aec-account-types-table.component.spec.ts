import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { OPAL_FINES_ENFORCEMENT_ACCOUNT_TYPES_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-enforcement-account-types.mock';
import { FinesAecPayloadService } from '../../../services/fines-aec-payload.service';
import { FinesAecAccountTypesTableComponent } from './fines-aec-account-types-table.component';

describe('FinesAecAccountTypesTableComponent', () => {
  let fixture: ComponentFixture<FinesAecAccountTypesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAecAccountTypesTableComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(FinesAecAccountTypesTableComponent);
    fixture.componentRef.setInput(
      'accountTypes',
      TestBed.inject(FinesAecPayloadService).transformAccountTypesForView(
        structuredClone(OPAL_FINES_ENFORCEMENT_ACCOUNT_TYPES_MOCK),
      ),
    );
  });

  it('renders read-only financial values under accessible column and row headings', () => {
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;

    expect(Array.from(element.querySelectorAll('thead th')).map((heading) => heading.textContent?.trim())).toEqual([
      'Account type',
      'Minimum enforcement value',
      'High value',
      'Actions',
    ]);
    expect(Array.from(element.querySelectorAll('tbody th[scope="row"]')).map((row) => row.textContent?.trim())).toEqual(
      ['Adult - Collection order', 'Adult - No collection order', 'Youth', 'Company'],
    );
    expect(element.querySelector('#aec-minimum-COL')?.textContent?.trim()).toBe('£100.00');
    expect(element.querySelector('#aec-high-COL')?.textContent?.trim()).toBe('£1,000.00');
    expect(element.querySelector('#aec-high-A')?.textContent?.trim()).toBe('-');
    expect(element.querySelector('input, select, textarea')).toBeNull();
  });

  it('renders zero thresholds as money and unavailable thresholds as dashes', () => {
    const accountTypes = fixture.componentInstance.accountTypes.map((row) => ({
      ...row,
      minimumBalance: row.accountType === 'COL' ? 0 : null,
      highValue: row.accountType === 'COL' ? 0 : null,
    }));
    fixture.componentRef.setInput('accountTypes', accountTypes);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('#aec-minimum-COL')?.textContent?.trim()).toBe('£0.00');
    expect(element.querySelector('#aec-high-COL')?.textContent?.trim()).toBe('£0.00');
    expect(element.querySelector('#aec-minimum-A')?.textContent?.trim()).toBe('-');
    expect(element.querySelector('#aec-high-A')?.textContent?.trim()).toBe('-');
  });

  it('gives every Change link its own low-path identifier and an accessible account type label', () => {
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;

    for (const accountType of fixture.componentInstance.accountTypes) {
      const link = element.querySelector<HTMLAnchorElement>(`#aec-change-${accountType.accountType}`);
      expect(link?.textContent?.replace(/\s+/g, ' ').trim()).toBe(`Change ${accountType.accountTypeName}`);
      expect(link?.getAttribute('href')).toContain(`amend-values?enforcementAccountTypeId=${accountType.id}`);
    }
  });
});
