import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent } from './fines-mac-offence-details-search-offences-results-table-wrapper.component';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS } from './constants/fines-mac-offence-details-search-offences-results-table-wrapper-link-defaults.constant';
import { FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_TABLE_DATA_MOCK } from './mocks/fines-mac-offence-details-search-offences-results-table-wrapper-table-data.mock';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent', () => {
  let component: FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let utilsService: any;

  beforeEach(async () => {
    utilsService = {
      copyToClipboard: vi.fn().mockName('UtilsService.copyToClipboard'),
    };

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent],
      providers: [{ provide: UtilsService, useValue: utilsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput(
      'tableData',
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_TABLE_DATA_MOCK,
    );
    fixture.componentRef.setInput('existingSortState', null);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render copy code as a button with row-specific hidden text', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button.copy-code-button');
    const firstButton = buttons[0];

    expect(buttons).toHaveLength(
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_TABLE_DATA_MOCK.length,
    );
    expect(fixture.nativeElement.querySelectorAll('a.govuk-link.govuk-link--no-visited-state')).toHaveLength(0);
    expect(firstButton.getAttribute('type')).toBe('button');
    expect(firstButton.textContent).toContain(
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS.COPY_CODE_TO_CLIPBOARD,
    );
    expect(firstButton.querySelector('.govuk-visually-hidden')?.textContent?.trim()).toBe(
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_TABLE_DATA_MOCK[0].Code,
    );
  });

  it('should copy the code and expose copied feedback for the selected row', () => {
    vi.useFakeTimers();

    const button = fixture.nativeElement.querySelectorAll('button.copy-code-button')[0] as HTMLButtonElement;
    const liveRegion = fixture.nativeElement.querySelectorAll('td#code .govuk-visually-hidden')[1] as HTMLSpanElement;

    button.click();
    fixture.detectChanges();

    expect(utilsService.copyToClipboard).toHaveBeenCalledWith(
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_TABLE_DATA_MOCK[0].Code,
    );
    expect(component.copiedCodeSignal()).toBe(
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_TABLE_DATA_MOCK[0].Code,
    );
    expect(button.textContent).toContain(
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS.COPIED_CODE_TO_CLIPBOARD,
    );
    expect(liveRegion.textContent?.trim()).toBe(
      `${FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS.COPIED_CODE_TO_CLIPBOARD} ${FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_TABLE_DATA_MOCK[0].Code}`,
    );

    vi.advanceTimersByTime(
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS.COPY_CODE_TO_CLIPBOARD_TIMEOUT,
    );
    fixture.detectChanges();

    expect(component.copiedCodeSignal()).toBeNull();
    expect(button.textContent).toContain(
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS.COPY_CODE_TO_CLIPBOARD,
    );
    expect(liveRegion.textContent?.trim()).toBe('');
  });

  it('should replace any existing reset timer when another code is copied', () => {
    vi.useFakeTimers();

    component.copyCodeToClipboard('1234');
    component.copyCodeToClipboard('5678');

    expect(utilsService.copyToClipboard).toHaveBeenNthCalledWith(1, '1234');
    expect(utilsService.copyToClipboard).toHaveBeenNthCalledWith(2, '5678');
    expect(component.copiedCodeSignal()).toBe('5678');

    vi.advanceTimersByTime(
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS.COPY_CODE_TO_CLIPBOARD_TIMEOUT,
    );

    expect(component.copiedCodeSignal()).toBeNull();
  });

  it('should return a screen reader announcement that includes the copied code', () => {
    expect(component.getCopyCodeAnnouncement('HY80120')).toBe('Code copied HY80120');
  });

  it('should clear the copyCodeTimeoutId on ngOnDestroy if timeout is set', () => {
    vi.useFakeTimers();
    component['copyCodeTimeoutId'] = setTimeout(() => {}, 1000);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(window, 'clearTimeout');

    component.ngOnDestroy();

    expect(window.clearTimeout).toHaveBeenCalledWith(expect.anything());
    expect(component['copyCodeTimeoutId']).not.toBeNull();
  });

  it('should not call clearTimeout on ngOnDestroy if copyCodeTimeoutId is null', () => {
    vi.useFakeTimers();
    component['copyCodeTimeoutId'] = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(window, 'clearTimeout');

    component.ngOnDestroy();

    expect(window.clearTimeout).not.toHaveBeenCalled();
  });
});
