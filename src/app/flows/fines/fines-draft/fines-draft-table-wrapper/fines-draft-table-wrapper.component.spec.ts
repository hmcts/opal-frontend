import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesDraftTableWrapperComponent } from './fines-draft-table-wrapper.component';
import { IFinesDraftTableWrapperTableData } from './interfaces/fines-draft-table-wrapper-table-data.interface';
import { IFinesDraftTableWrapperTableSort } from './interfaces/fines-draft-table-wrapper-table-sort.interface';
import { FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT } from './constants/fines-draft-table-wrapper-table-sort.constants';
import { FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK } from './mocks/fines-draft-table-wrapper-table-data.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesDraftTableWrapperComponent', () => {
  let component: FinesDraftTableWrapperComponent;
  let fixture: ComponentFixture<FinesDraftTableWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesDraftTableWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesDraftTableWrapperComponent);
    component = fixture.componentInstance;

    component.tableData = FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK;
    component.existingSortState = FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set displayTableDataSignal when tableData input is provided', () => {
    const testData: IFinesDraftTableWrapperTableData[] = FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK;
    component.tableData = testData;
    expect(component.displayTableDataSignal()).toEqual(testData);
  });

  it('should set abstractExistingSortState when existingSortState input is provided', () => {
    const sortState: IFinesDraftTableWrapperTableSort = FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT;
    component.existingSortState = sortState;
    expect(component.abstractExistingSortState).toEqual(sortState);
  });

  it('should accept activeTab input', () => {
    component.activeTab = 'approved';
    expect(component.activeTab).toBe('approved');
  });

  it('should emit linkClicked event with the correct id when onDefendantClick is called', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component.linkClicked, 'emit');

    component.onDefendantClick(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK[0]);

    expect(component.linkClicked.emit).toHaveBeenCalledWith(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK[0]);
  });

  it('should emit accountClicked event with the correct account number when onAccountClick is called', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component.accountClicked, 'emit');

    const testAccountId = 77;
    component.onAccountClick(testAccountId);

    expect(component.accountClicked.emit).toHaveBeenCalledWith(testAccountId);
  });

  it('should enforce current template link semantics', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const templateConsts = ((FinesDraftTableWrapperComponent as any).ɵcmp?.consts ?? []).filter((entry: unknown) =>
      Array.isArray(entry),
    ) as unknown[][];
    const templateFunction =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((FinesDraftTableWrapperComponent as any).ɵcmp?.template?.toString() as string | undefined) ?? '';
    const actionLinkConsts = templateConsts.filter(
      (entry) =>
        entry.includes('govuk-link') &&
        entry.includes('govuk-link--no-visited-state') &&
        entry.includes('href') &&
        entry.includes('click'),
    );

    expect(actionLinkConsts.length).toBeGreaterThanOrEqual(1);
    actionLinkConsts.forEach((entry) => {
      expect(entry).toContain('href');
      expect(entry).toContain('');
      expect(entry).not.toContain('tabindex');
    });
    expect(templateFunction).not.toContain('keydown.enter');
    expect(templateFunction).not.toContain('keyup.enter');
  });

  it('should click defendant link and preserve current template click behaviour', () => {
    component.activeTab = 'review';
    component.tableData = FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK;
    fixture.detectChanges();

    const defendantName = FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK[0].Defendant;
    const links = Array.from(fixture.nativeElement.querySelectorAll('a.govuk-link')) as HTMLAnchorElement[];
    const link = links.find((anchor) => anchor.textContent?.trim() === defendantName) ?? null;
    expect(link).toBeTruthy();
    if (!link) throw new Error('Defendant link not found');

    expect(link.classList.contains('govuk-link--no-visited-state')).toBe(true);
    expect(link.getAttribute('href')).toBe('');
    expect(link.getAttribute('tabindex')).toBeNull();

    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handlerSpy = vi.spyOn<any, any>(component, 'onDefendantClick');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emitSpy = vi.spyOn<any, any>(component.linkClicked, 'emit');

    link.dispatchEvent(event);

    expect(handlerSpy).toHaveBeenCalledWith(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK[0], event);
    expect(event.defaultPrevented).toBe(true);
    expect(emitSpy).toHaveBeenCalledWith(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK[0]);
  });

  it('should click account link and preserve current template click behaviour', () => {
    fixture.componentRef.setInput('activeTab', 'approved');
    fixture.componentRef.setInput('tableData', FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);
    fixture.detectChanges();

    const accountNumber = FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK[0].Account;
    const links = Array.from(fixture.nativeElement.querySelectorAll('a.govuk-link')) as HTMLAnchorElement[];
    const link = links.find((anchor) => anchor.textContent?.trim() === accountNumber) ?? null;
    if (!link) {
      const linkTexts = links.map((anchor) => anchor.textContent?.trim());
      throw new Error(`Account link not found. Available links: ${linkTexts.join(', ')}`);
    }

    expect(link.classList.contains('govuk-link--no-visited-state')).toBe(true);
    expect(link.getAttribute('href')).toBe('');
    expect(link.getAttribute('tabindex')).toBeNull();

    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handlerSpy = vi.spyOn<any, any>(component, 'onAccountClick');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emitSpy = vi.spyOn<any, any>(component.accountClicked, 'emit');

    link.dispatchEvent(event);

    expect(handlerSpy).toHaveBeenCalledWith(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK[0]['Defendant id'], event);
    expect(event.defaultPrevented).toBe(true);
    expect(emitSpy).toHaveBeenCalledWith(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK[0]['Defendant id']);
  });

  it('should prevent default and emit accountClicked when onAccountClick is called with an event', () => {
    const event = new Event('click');
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emitSpy = vi.spyOn<any, any>(component.accountClicked, 'emit');
    const accountId = FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK[0]['Defendant id'];

    component.onAccountClick(accountId, event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith(accountId);
  });
});
