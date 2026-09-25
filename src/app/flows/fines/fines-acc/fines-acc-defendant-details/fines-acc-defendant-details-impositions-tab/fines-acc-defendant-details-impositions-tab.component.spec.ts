import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-impositions.mock';
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

  it.each([
    {
      description: 'populated reference fields',
      offence: { offence_id: 33369, cjs_code: 'HY35014', offence_title: 'Test offence title' },
    },
    {
      description: 'null reference fields',
      offence: { offence_id: null, cjs_code: null, offence_title: 'Test offence title' },
    },
  ])('should display the offence title with $description', ({ offence }) => {
    const tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK);
    tabData.impositions[0].offence = offence;

    const { fixture } = setupComponent(tabData);
    const offenceCell = fixture.nativeElement.querySelector('#imposition-offence-0') as HTMLTableCellElement;

    expect(offenceCell.textContent?.trim()).toBe('Test offence title');
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
    expect(paidAmountCell.querySelector('[aria-hidden="true"]')?.textContent?.trim()).toBe('-£50.00');
    expect(balanceCell.querySelector('[aria-hidden="true"]')?.textContent?.trim()).toBe('-£150.00');
  });

  it('should expose accessible minus text for negative paid and balance amounts', () => {
    const tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK);
    tabData.impositions[0].paid_amount = -50;
    tabData.impositions[0].balance = -150;

    const { fixture } = setupComponent(tabData);

    const paidAmountCell = fixture.nativeElement.querySelector('#imposition-paid-amount-0') as HTMLTableCellElement;
    const balanceCell = fixture.nativeElement.querySelector('#imposition-balance-0') as HTMLTableCellElement;
    const paidVisibleAmount = paidAmountCell.querySelector('[aria-hidden="true"]') as HTMLSpanElement;
    const balanceVisibleAmount = balanceCell.querySelector('[aria-hidden="true"]') as HTMLSpanElement;
    const paidAccessibleAmount = paidAmountCell.querySelector('.govuk-visually-hidden') as HTMLSpanElement;
    const balanceAccessibleAmount = balanceCell.querySelector('.govuk-visually-hidden') as HTMLSpanElement;

    expect(paidVisibleAmount.textContent?.trim()).toBe('-£50.00');
    expect(balanceVisibleAmount.textContent?.trim()).toBe('-£150.00');
    expect(paidAccessibleAmount.textContent?.trim()).toBe('minus £50.00');
    expect(balanceAccessibleAmount.textContent?.trim()).toBe('minus £150.00');
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

  it('should use the minor creditor code even when the display label differs', () => {
    const tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK);
    tabData.impositions[1].creditor.creditor_account_type_reference.creditor_account_display_name = 'Major Creditor';

    const { fixture } = setupComponent(tabData);
    const minorCreditorLink = fixture.nativeElement.querySelector('#imposition-creditor-1 a') as HTMLAnchorElement;

    expect(minorCreditorLink).toBeTruthy();
    expect(minorCreditorLink.textContent).toContain('Minor Creditor Test Ltd');
    expect(minorCreditorLink.getAttribute('href')).toBe('/fines/account/minor-creditor/660000000001/details');
  });

  it('should render major creditor names as links to major creditor details', () => {
    const { fixture } = setupComponent();
    const majorCreditorLink = fixture.nativeElement.querySelector('#imposition-creditor-0 a') as HTMLAnchorElement;

    expect(majorCreditorLink).toBeTruthy();
    expect(majorCreditorLink.textContent).toContain('Central Funds');
    expect(majorCreditorLink.getAttribute('href')).toBe('/fines/account/major-creditor/770000000001/details');
  });

  it('should use the major creditor code even when the display label differs', () => {
    const tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK);
    tabData.impositions[0].creditor.creditor_account_type_reference.creditor_account_display_name = 'Minor Creditor';

    const { fixture } = setupComponent(tabData);
    const majorCreditorLink = fixture.nativeElement.querySelector('#imposition-creditor-0 a') as HTMLAnchorElement;

    expect(majorCreditorLink).toBeTruthy();
    expect(majorCreditorLink.textContent).toContain('Central Funds');
    expect(majorCreditorLink.getAttribute('href')).toBe('/fines/account/major-creditor/770000000001/details');
  });

  it('should render Central Fund as plain text', () => {
    const { fixture } = setupComponent();
    const creditorCell = fixture.nativeElement.querySelector('#imposition-creditor-2') as HTMLTableCellElement;

    expect(creditorCell.querySelector('a')).toBeNull();
    expect(creditorCell.textContent).toContain('Central Fund');
  });

  it.each([
    {
      description: 'the display name when the creditor name is unavailable',
      creditorName: null,
      displayName: 'Major Creditor' as const,
      expected: 'Major Creditor',
    },
    {
      description: 'the creditor account ID when both creditor names are unavailable',
      creditorName: null,
      displayName: null,
      expected: '770000000001',
    },
    {
      description: 'the creditor account ID when the name is empty and the display name is null',
      creditorName: '',
      displayName: null,
      expected: '770000000001',
    },
    {
      description: 'the creditor account ID when the name is whitespace and the display name is null',
      creditorName: '   ',
      displayName: null,
      expected: '770000000001',
    },
  ])('should display $description', ({ creditorName, displayName, expected }) => {
    const tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK);
    tabData.impositions[0].creditor.major_creditor_name = creditorName;
    tabData.impositions[0].creditor.creditor_account_type_reference.creditor_account_display_name = displayName;

    const { fixture } = setupComponent(tabData);
    const creditorCell = fixture.nativeElement.querySelector('#imposition-creditor-0') as HTMLTableCellElement;

    expect(creditorCell.textContent?.trim()).toBe(expected);
    expect(creditorCell.querySelector('a')?.getAttribute('href')).toBe(
      '/fines/account/major-creditor/770000000001/details',
    );
  });

  it.each([
    {
      description: 'forenames and surname',
      individual: { forenames: 'Alex James', surname: 'Smith' },
      expected: 'Alex James Smith',
    },
    { description: 'null forenames', individual: { forenames: null, surname: 'Smith' }, expected: 'Smith' },
    { description: 'missing individual details', individual: null, expected: 'Minor Creditor' },
    { description: 'an empty surname', individual: { forenames: null, surname: '' }, expected: 'Minor Creditor' },
    {
      description: 'whitespace-only forenames and surname',
      individual: { forenames: '   ', surname: '   ' },
      expected: 'Minor Creditor',
    },
  ])('should display a minor creditor with $description', ({ individual, expected }) => {
    const tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK);
    tabData.impositions[1].creditor.minor_creditor_organisation_flag = false;
    tabData.impositions[1].creditor.individual_name = individual;

    const { fixture } = setupComponent(tabData);
    const creditorCell = fixture.nativeElement.querySelector('#imposition-creditor-1') as HTMLTableCellElement;

    expect(creditorCell.textContent?.trim()).toBe(expected);
    expect(creditorCell.querySelector('a')?.getAttribute('href')).toBe(
      '/fines/account/minor-creditor/660000000001/details',
    );
  });

  it('should select the company name when the organisation flag is true', () => {
    const tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK);
    tabData.impositions[1].creditor.company_name = { organisation_name: 'Updated Company Ltd' };
    tabData.impositions[1].creditor.individual_name = { forenames: null, surname: 'Smith' };

    const { fixture } = setupComponent(tabData);
    const creditorCell = fixture.nativeElement.querySelector('#imposition-creditor-1') as HTMLTableCellElement;

    expect(creditorCell.textContent?.trim()).toBe('Updated Company Ltd');
  });

  it('should use the account-type label when company details are missing', () => {
    const tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK);
    tabData.impositions[1].creditor.company_name = null;

    const { fixture } = setupComponent(tabData);
    const creditorCell = fixture.nativeElement.querySelector('#imposition-creditor-1') as HTMLTableCellElement;

    expect(creditorCell.textContent?.trim()).toBe('Minor Creditor');
  });

  it.each(['', '   '])('should retain the minor creditor link when the company name is "%s"', (name) => {
    const tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK);
    tabData.impositions[1].creditor.company_name = { organisation_name: name };

    const { fixture } = setupComponent(tabData);
    const creditorLink = fixture.nativeElement.querySelector('#imposition-creditor-1 a') as HTMLAnchorElement;

    expect(creditorLink?.textContent?.trim()).toBe('Minor Creditor');
    expect(creditorLink?.getAttribute('href')).toBe('/fines/account/minor-creditor/660000000001/details');
  });

  it.each(['', '   '])('should retain the major creditor link when the name is "%s"', (name) => {
    const tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK);
    tabData.impositions[0].creditor.major_creditor_name = name;

    const { fixture } = setupComponent(tabData);
    const creditorLink = fixture.nativeElement.querySelector('#imposition-creditor-0 a') as HTMLAnchorElement;

    expect(creditorLink?.textContent?.trim()).toBe('Major Creditor');
    expect(creditorLink?.getAttribute('href')).toBe('/fines/account/major-creditor/770000000001/details');
  });

  it.each(['', '   '])('should display Central Fund without a link when the company name is "%s"', (name) => {
    const tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK);
    tabData.impositions[2].creditor.company_name = { organisation_name: name };

    const { fixture } = setupComponent(tabData);
    const creditorCell = fixture.nativeElement.querySelector('#imposition-creditor-2') as HTMLTableCellElement;

    expect(creditorCell.textContent?.trim()).toBe('Central Fund');
    expect(creditorCell.querySelector('a')).toBeNull();
  });

  it('should use the supplied major creditor name', () => {
    const tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK);
    tabData.impositions[0].creditor.major_creditor_name = 'Updated Major Creditor';
    tabData.impositions[0].creditor.company_name = { organisation_name: 'Unused company name' };

    const { fixture } = setupComponent(tabData);
    const creditorCell = fixture.nativeElement.querySelector('#imposition-creditor-0') as HTMLTableCellElement;

    expect(creditorCell.textContent?.trim()).toBe('Updated Major Creditor');
  });

  it('should display the Central Fund company name with a null organisation flag', () => {
    const tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK);
    tabData.impositions[2].creditor.minor_creditor_organisation_flag = null;
    tabData.impositions[2].creditor.company_name = { organisation_name: 'Central Fund Organisation' };

    const { fixture } = setupComponent(tabData);
    const creditorCell = fixture.nativeElement.querySelector('#imposition-creditor-2') as HTMLTableCellElement;

    expect(creditorCell.textContent?.trim()).toBe('Central Fund Organisation');
  });

  it('should announce the new page and focus its first date cell after rendering', async () => {
    const { component, fixture } = setupComponent();
    fixture.componentRef.setInput('paginationPageTitle', 'John Smith');

    expect(component.paginatedTableDataComputed()).toHaveLength(25);
    expect(fixture.nativeElement.querySelector('opal-lib-moj-pagination')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Major Creditor 1');
    expect(fixture.nativeElement.textContent).not.toContain('Major Creditor 23');

    component.onPageChange(2);
    fixture.detectChanges();
    await fixture.whenStable();

    const firstCell = fixture.nativeElement.querySelector('#imposition-date-added-0') as HTMLTableCellElement;
    const status = fixture.nativeElement.querySelector('output') as HTMLOutputElement;
    expect(component.currentPageSignal()).toBe(2);
    expect(component.paginatedTableDataComputed()).toHaveLength(8);
    expect(fixture.nativeElement.textContent).toContain('Major Creditor 23');
    expect(fixture.nativeElement.textContent).not.toContain('Central Funds');
    expect(firstCell.getAttribute('tabindex')).toBe('-1');
    expect(document.activeElement).toBe(firstCell);
    expect(status.textContent?.trim()).toBe('John Smith, page 2 of 2');
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
    const zeroBalanceRow = fixture.nativeElement.querySelector(
      'tr.govuk-light-grey-background-colour',
    ) as HTMLTableRowElement;
    const zeroBalanceCell = zeroBalanceRow.querySelector('[id^="imposition-balance-"]') as HTMLTableCellElement;

    expect(zeroBalanceRow).toBeTruthy();
    expect(zeroBalanceCell.textContent?.trim()).toBe('—');
    expect(zeroBalanceRow.textContent).toContain('Minor Creditor Test Ltd');
  });

  it('should leave imposed by blank when imposing court id is not present', () => {
    const { fixture } = setupComponent();
    const imposedByCell = fixture.nativeElement.querySelector('#imposition-imposed-by-1') as HTMLTableCellElement;

    expect(imposedByCell.textContent?.trim()).toBe('');
  });

  it('should leave the imposing court blank when null', () => {
    const tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK);
    tabData.impositions[0].imposed_by = null;

    const { fixture } = setupComponent(tabData);
    const cell = fixture.nativeElement.querySelector('#imposition-imposed-by-0') as HTMLTableCellElement;

    expect(cell.textContent?.trim()).toBe('');
  });

  it('should display the court name with a null court code', () => {
    const tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK);
    tabData.impositions[0].imposed_by = { court_id: 101, court_code: null, court_name: 'Test Court' };

    const { fixture } = setupComponent(tabData);
    const cell = fixture.nativeElement.querySelector('#imposition-imposed-by-0') as HTMLTableCellElement;

    expect(cell.textContent?.trim()).toBe('Test Court');
  });

  it('should render balance rounded to two decimal places', () => {
    const tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK);
    tabData.impositions[0].balance = 9.899999999;

    const { fixture } = setupComponent(tabData);
    const balanceCell = fixture.nativeElement.querySelector('#imposition-balance-0') as HTMLTableCellElement;

    expect(balanceCell.textContent?.trim()).toBe('£9.90');
  });

  it('should render an empty state when there are no impositions', () => {
    const { fixture } = setupComponent({
      version: null,
      impositions: [],
    });

    expect(fixture.nativeElement.textContent).toContain('There are no impositions for this account.');
  });
});
