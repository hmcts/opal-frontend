import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_CONSOLIDATED_ACCOUNTS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-consolidated-accounts.mock';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesAccDefendantDetailsConsolidatedAccountsTabComponent } from './fines-acc-defendant-details-consolidated-accounts-tab.component';

describe('FinesAccDefendantDetailsConsolidatedAccountsTabComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccDefendantDetailsConsolidatedAccountsTabComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  const setupComponent = (
    tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_CONSOLIDATED_ACCOUNTS_MOCK),
  ): {
    component: FinesAccDefendantDetailsConsolidatedAccountsTabComponent;
    fixture: ComponentFixture<FinesAccDefendantDetailsConsolidatedAccountsTabComponent>;
  } => {
    const fixture = TestBed.createComponent(FinesAccDefendantDetailsConsolidatedAccountsTabComponent);
    const component = fixture.componentInstance;

    fixture.componentRef.setInput('tabData', tabData);
    fixture.detectChanges();

    return { component, fixture };
  };

  it('should create', () => {
    const { component } = setupComponent();

    expect(component).toBeTruthy();
  });

  it('should render consolidated account rows', () => {
    const { fixture } = setupComponent();
    const textContent = fixture.nativeElement.textContent;

    expect(fixture.nativeElement.querySelector('table.govuk-table')).toBeTruthy();
    expect(textContent).toContain('99009902C');
    expect(textContent).toContain('CHILD, Casey');
    expect(textContent).toContain('21 Jan 2026');
    expect(textContent).toContain('Seed Child Court');
    expect(textContent).toContain('LOCAL-CONSOL-CHILD');
  });

  it('should render account number as a link to the child account at-a-glance view', () => {
    const { fixture } = setupComponent();
    const link = fixture.nativeElement.querySelector('#consolidated-account-number-0 a') as HTMLAnchorElement;

    expect(link).toBeTruthy();
    expect(link.textContent).toContain('99009902C');
    expect(link.getAttribute('href')).toBe('/fines/account/defendant/99000000990002/details#at-a-glance');
  });

  it('should right-align the date imposed column', () => {
    const { fixture } = setupComponent();
    const dateCell = fixture.nativeElement.querySelector(
      '#consolidated-account-date-imposed-0',
    ) as HTMLTableCellElement;

    expect(dateCell.classList).toContain('govuk-table__cell--numeric');
  });

  it('should render an empty state when there are no consolidated accounts', () => {
    const tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_CONSOLIDATED_ACCOUNTS_MOCK);
    tabData.consolidated_accounts = [];

    const { fixture } = setupComponent(tabData);

    expect(fixture.nativeElement.querySelector('table.govuk-table')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('There are no consolidated accounts for this account.');
  });
});
