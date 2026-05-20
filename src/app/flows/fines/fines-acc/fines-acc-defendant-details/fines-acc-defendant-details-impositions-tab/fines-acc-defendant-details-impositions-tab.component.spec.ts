import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-impositions-tab-ref-data.mock';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesAccDefendantDetailsImpositionsTabComponent } from './fines-acc-defendant-details-impositions-tab.component';

describe('FinesAccDefendantDetailsImpositionsTabComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccDefendantDetailsImpositionsTabComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  const setupComponent = (
    tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK),
  ): {
    component: FinesAccDefendantDetailsImpositionsTabComponent;
    fixture: ComponentFixture<FinesAccDefendantDetailsImpositionsTabComponent>;
  } => {
    const fixture = TestBed.createComponent(FinesAccDefendantDetailsImpositionsTabComponent);
    const component = fixture.componentInstance;

    fixture.componentRef.setInput('tabData', tabData);
    fixture.detectChanges();

    return { component, fixture };
  };

  it('should create', () => {
    const { component } = setupComponent();

    expect(component).toBeTruthy();
  });

  it('should render imposition rows with formatted dates and amounts', () => {
    const { fixture } = setupComponent();
    const textContent = fixture.nativeElement.textContent;

    expect(fixture.nativeElement.querySelector('opal-lib-moj-sortable-table')).toBeTruthy();
    expect(textContent).toContain('31 Jan 2025');
    expect(textContent).toContain('FO');
    expect(textContent).toContain('Central Funds');
    expect(textContent).toContain('£200.00');
    expect(textContent).toContain('£50.00');
    expect(textContent).toContain('£150.00');
    expect(textContent).toContain('30 Jan 2025');
    expect(textContent).toContain('Speeding - exceed 30mph on restricted road');
    expect(textContent).toContain('West London Magistrates Court');
    expect(textContent).toContain('111111111111');
  });

  it('should render API date strings with the shared date format pipe', () => {
    const tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK);
    tabData.impositions[0].date_added = '2025-12-05';
    tabData.impositions[0].date_imposed = '2025-12-04';

    const { fixture } = setupComponent(tabData);

    const textContent = fixture.nativeElement.textContent;

    expect(textContent).toContain('05 Dec 2025');
    expect(textContent).toContain('04 Dec 2025');
  });

  it('should remove the minus symbol from imposed amount only', () => {
    const tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK);
    tabData.impositions[0].imposed_amount = -200;
    tabData.impositions[0].paid_amount = -50;
    tabData.impositions[0].balance = -150;

    const { fixture } = setupComponent(tabData);

    const imposedAmountCell = fixture.nativeElement.querySelector(
      '#imposition-imposed-amount-0',
    ) as HTMLTableCellElement;
    const paidAmountCell = fixture.nativeElement.querySelector('#imposition-paid-amount-0') as HTMLTableCellElement;
    const balanceCell = fixture.nativeElement.querySelector('#imposition-balance-0') as HTMLTableCellElement;

    expect(imposedAmountCell.textContent?.trim()).toBe('£200.00');
    expect(paidAmountCell.textContent?.trim()).toBe('-£50.00');
    expect(balanceCell.textContent?.trim()).toBe('-£150.00');
  });

  it('should sort rows when a sortable header is clicked', () => {
    const { component, fixture } = setupComponent();
    const balanceHeaderButton = fixture.nativeElement.querySelector(
      'th[columnkey="Balance"] button',
    ) as HTMLButtonElement;

    balanceHeaderButton.click();
    fixture.detectChanges();

    const firstCreditorCell = fixture.nativeElement.querySelector('#imposition-creditor-0') as HTMLTableCellElement;

    expect(component.sortedColumnTitleSignal()).toBe('Balance');
    expect(component.sortedColumnDirectionSignal()).toBe('ascending');
    expect(firstCreditorCell.textContent).toContain('Minor Creditor Test Ltd');
  });

  it('should render minor creditor names as links to minor creditor details', () => {
    const { fixture } = setupComponent();
    const minorCreditorLink = fixture.nativeElement.querySelector('#imposition-creditor-1 a') as HTMLAnchorElement;

    expect(minorCreditorLink).toBeTruthy();
    expect(minorCreditorLink.textContent).toContain('Minor Creditor Test Ltd');
    expect(minorCreditorLink.getAttribute('href')).toBe('/fines/account/minor-creditor/660000000001/details');
  });

  it('should render major creditor names as plain text until major creditor details exists', () => {
    const { fixture } = setupComponent();
    const majorCreditorCell = fixture.nativeElement.querySelector('#imposition-creditor-0') as HTMLTableCellElement;

    expect(majorCreditorCell.querySelector('a')).toBeNull();
    expect(majorCreditorCell.textContent).toContain('Central Funds');
  });

  it('should paginate imposition rows at 25 results per page', () => {
    const { component, fixture } = setupComponent();

    expect(component.paginatedTableDataComputed()).toHaveLength(25);
    expect(fixture.nativeElement.querySelector('opal-lib-moj-pagination')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Major Creditor 1');
    expect(fixture.nativeElement.textContent).not.toContain('Major Creditor 23');

    component.onPageChange(2);
    fixture.detectChanges();

    expect(component.currentPageSignal()).toBe(2);
    expect(component.paginatedTableDataComputed()).toHaveLength(8);
    expect(fixture.nativeElement.textContent).toContain('Major Creditor 23');
    expect(fixture.nativeElement.textContent).not.toContain('Central Funds');
  });

  it('should not render pagination when there are 25 or fewer imposition rows', () => {
    const tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK);
    tabData.impositions = tabData.impositions.slice(0, 3);

    const { component, fixture } = setupComponent(tabData);

    expect(component.paginatedTableDataComputed()).toHaveLength(3);
    expect(fixture.nativeElement.querySelector('opal-lib-moj-pagination')).toBeNull();
  });

  it('should display a dash and grey row for zero balance impositions', () => {
    const { fixture } = setupComponent();
    const zeroBalanceRow = fixture.nativeElement.querySelector('tr.govuk-light-grey-background-colour');
    const zeroBalanceCell = fixture.nativeElement.querySelector('#imposition-balance-1') as HTMLTableCellElement;

    expect(zeroBalanceRow).toBeTruthy();
    expect(zeroBalanceCell.textContent?.trim()).toBe('-');
    expect(zeroBalanceRow.textContent).toContain('Minor Creditor Test Ltd');
  });

  it('should leave imposed by blank when imposing court id is not present', () => {
    const { fixture } = setupComponent();
    const imposedByCell = fixture.nativeElement.querySelector('#imposition-imposed-by-1') as HTMLTableCellElement;

    expect(imposedByCell.textContent?.trim()).toBe('');
  });

  it('should calculate balance rounded to two decimal places', () => {
    const { component } = setupComponent();
    const balance = component.getBalance({
      ...OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK.impositions[0],
      balance: 9.899999999,
    });

    expect(balance).toBe(9.9);
  });

  it('should render an empty state when there are no impositions', () => {
    const { fixture } = setupComponent({
      version: null,
      impositions: [],
    });

    expect(fixture.nativeElement.textContent).toContain('There are no impositions for this account.');
  });
});
