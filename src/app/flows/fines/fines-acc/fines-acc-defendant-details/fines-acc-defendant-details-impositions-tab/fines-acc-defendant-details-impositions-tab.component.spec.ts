import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-impositions-tab-ref-data.mock';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesAccDefendantDetailsImpositionsTabComponent } from './fines-acc-defendant-details-impositions-tab.component';

describe('FinesAccDefendantDetailsImpositionsTabComponent', () => {
  let component: FinesAccDefendantDetailsImpositionsTabComponent;
  let fixture: ComponentFixture<FinesAccDefendantDetailsImpositionsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccDefendantDetailsImpositionsTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDefendantDetailsImpositionsTabComponent);
    component = fixture.componentInstance;
    component.tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render imposition rows with formatted dates and amounts', () => {
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
    expect(textContent).toContain('11111111-1111-1111-1111-111111111111');
  });

  it('should render date strings with the shared date format pipe', () => {
    const tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK);
    tabData.impositions[0].posted_date = '05/12/2025';
    tabData.impositions[0].imposed_date = '04/12/2025';

    fixture.componentRef.setInput('tabData', tabData);
    fixture.detectChanges();

    const textContent = fixture.nativeElement.textContent;

    expect(textContent).toContain('05 Dec 2025');
    expect(textContent).toContain('04 Dec 2025');
  });

  it('should sort rows when a sortable header is clicked', () => {
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

  it('should display a dash and grey row for zero balance impositions', () => {
    const zeroBalanceRow = fixture.nativeElement.querySelector('tr.govuk-light-grey-background-colour');
    const zeroBalanceCell = fixture.nativeElement.querySelector('#imposition-balance-1') as HTMLTableCellElement;

    expect(zeroBalanceRow).toBeTruthy();
    expect(zeroBalanceCell.textContent?.trim()).toBe('-');
    expect(zeroBalanceRow.textContent).toContain('Minor Creditor Test Ltd');
  });

  it('should leave imposed by blank when imposing court id is not present', () => {
    const imposedByCell = fixture.nativeElement.querySelector('#imposition-imposed-by-1') as HTMLTableCellElement;

    expect(imposedByCell.textContent?.trim()).toBe('');
  });

  it('should calculate balance rounded to two decimal places', () => {
    const balance = component.getBalance({
      ...OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK.impositions[0],
      imposed_amount: 10.1,
      paid_amount: 0.2,
    });

    expect(balance).toBe(9.9);
  });

  it('should render an empty state when there are no impositions', () => {
    fixture.componentRef.setInput('tabData', {
      version: null,
      impositions: [],
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('There are no impositions for this account.');
  });
});
