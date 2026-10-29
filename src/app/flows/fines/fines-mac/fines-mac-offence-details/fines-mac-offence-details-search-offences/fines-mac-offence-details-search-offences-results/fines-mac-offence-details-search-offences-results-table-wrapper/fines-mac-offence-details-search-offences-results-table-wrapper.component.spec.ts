import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { RELEASE_1A_1_2_FEATURE_FLAG } from '../../../../../constants/release-feature-flags.constant';
import { FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent } from './fines-mac-offence-details-search-offences-results-table-wrapper.component';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS } from './constants/fines-mac-offence-details-search-offences-results-table-wrapper-link-defaults.constant';
import { FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_TABLE_DATA_MOCK } from './mocks/fines-mac-offence-details-search-offences-results-table-wrapper-table-data.mock';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent', () => {
  let component: FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent>;
  let globalStore: InstanceType<typeof GlobalStore>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let utilsService: any;

  beforeEach(async () => {
    utilsService = {
      copyToClipboard: vi.fn().mockName('UtilsService.copyToClipboard'),
      focusAndScrollToTop: vi.fn().mockName('UtilsService.focusAndScrollToTop'),
    };

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent],
      providers: [{ provide: UtilsService, useValue: utilsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent);
    component = fixture.componentInstance;

    globalStore = TestBed.inject(GlobalStore);
    globalStore.setFeatureFlags({
      [RELEASE_1A_1_2_FEATURE_FLAG]: true,
    });

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

  it('should display the original Copy code links when release-1a-1-2 is disabled', () => {
    globalStore.setFeatureFlags({
      [RELEASE_1A_1_2_FEATURE_FLAG]: false,
    });
    fixture.detectChanges();

    const copyLinks = fixture.nativeElement.querySelectorAll('td#code a.govuk-link.govuk-link--no-visited-state');

    const copyButtons = fixture.nativeElement.querySelectorAll('td#actions button');

    const actionsHeader = Array.from(
      fixture.nativeElement.querySelectorAll('thead th') as NodeListOf<HTMLTableCellElement>,
    ).find((header) => header.textContent?.trim() === 'Actions');

    expect(copyLinks).toHaveLength(
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_TABLE_DATA_MOCK.length,
    );

    expect(copyButtons).toHaveLength(0);
    expect(actionsHeader).toBeUndefined();
  });

  it('should copy the offence code using the original link when release-1a-1-2 is disabled', () => {
    globalStore.setFeatureFlags({
      [RELEASE_1A_1_2_FEATURE_FLAG]: false,
    });
    fixture.detectChanges();

    const copyLink = fixture.nativeElement.querySelector(
      'td#code a.govuk-link.govuk-link--no-visited-state',
    ) as HTMLAnchorElement;

    const liveRegion = fixture.nativeElement.querySelector(
      'td#code > span.govuk-visually-hidden[aria-live]',
    ) as HTMLSpanElement;

    expect(copyLink).toBeTruthy();

    copyLink.click();
    fixture.detectChanges();

    expect(utilsService.copyToClipboard).toHaveBeenCalledWith(
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_TABLE_DATA_MOCK[0].Code,
    );

    const copyCodeLabel = copyLink.querySelector('span:not(.govuk-visually-hidden)') as HTMLSpanElement;

    expect(copyCodeLabel.innerText).toBe(
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS.COPIED_CODE_TO_CLIPBOARD,
    );

    expect(liveRegion.textContent).toBe(
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS.COPIED_CODE_TO_CLIPBOARD,
    );
  });

  it.each([
    ['polite', 'polite'],
    [null, null],
  ])('should restore the original link aria-live value %s after copying', (originalAriaLive, expectedAriaLive) => {
    vi.useFakeTimers();
    const linkElement = document.createElement('a');
    const labelElement = document.createElement('span');
    const liveRegion = document.createElement('span');
    labelElement.innerText = 'Copy code';
    if (originalAriaLive) {
      linkElement.setAttribute('aria-live', originalAriaLive);
    }
    const event = new Event('click', { cancelable: true });

    component.copyCodeToClipboardFromLink(linkElement, labelElement, liveRegion, '1234', event);

    expect(event.defaultPrevented).toBe(true);
    expect(linkElement.getAttribute('aria-live')).toBe('assertive');
    expect(liveRegion.textContent).toBe(
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS.COPIED_CODE_TO_CLIPBOARD,
    );

    vi.advanceTimersByTime(
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS.COPY_CODE_TO_CLIPBOARD_TIMEOUT,
    );

    expect(labelElement.innerText).toBe('Copy code');
    expect(linkElement.getAttribute('aria-live')).toBe(expectedAriaLive);
    expect(liveRegion.textContent).toBe('');
    expect(component['copyCodeTimeoutId']).toBeNull();
  });

  it('should render a copy code button with a unique visually hidden code for each offence', () => {
    const copyButtons = fixture.nativeElement.querySelectorAll('td#actions button');

    expect(copyButtons).toHaveLength(
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_TABLE_DATA_MOCK.length,
    );

    copyButtons.forEach((button: HTMLButtonElement, index: number) => {
      expect(button.type).toBe('button');
      expect(button.textContent).toContain(
        FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS.COPY_CODE_TO_CLIPBOARD,
      );
      expect(button.querySelector('.govuk-visually-hidden')?.textContent?.trim()).toBe(
        FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_TABLE_DATA_MOCK[index].Code,
      );
    });
  });

  it('should generate unique button IDs when offence codes are duplicated', () => {
    const mockData = FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_TABLE_DATA_MOCK;

    const duplicateCodeData = [{ ...mockData[0] }, { ...mockData[0] }, { ...mockData[0] }];

    fixture.componentRef.setInput('tableData', duplicateCodeData);
    fixture.detectChanges();

    const copyButtons = fixture.nativeElement.querySelectorAll('td#actions button') as NodeListOf<HTMLButtonElement>;

    const buttonIds = Array.from(copyButtons, (button) => button.id);

    expect(copyButtons).toHaveLength(3);
    expect(buttonIds.every((id) => id.length > 0)).toBe(true);
    expect(new Set(buttonIds).size).toBe(3);
  });

  it('should announce the new page and focus its first code after rendering', async () => {
    component.itemsPerPageSignal.set(1);
    fixture.componentRef.setInput('paginationPageTitle', 'Search results');
    fixture.detectChanges();

    component.onPageChange(2);
    fixture.detectChanges();
    await fixture.whenStable();

    const firstCodeCell = fixture.nativeElement.querySelector('td#code') as HTMLTableCellElement;
    const status = fixture.nativeElement.querySelector('output') as HTMLOutputElement;
    expect(firstCodeCell.firstChild?.textContent?.trim()).toBe('5678');
    expect(firstCodeCell.getAttribute('tabindex')).toBe('-1');
    expect(document.activeElement).toBe(firstCodeCell);
    expect(status.textContent?.trim()).toBe('Search results, page 2 of 3');
    expect(utilsService.focusAndScrollToTop).not.toHaveBeenCalled();
  });

  it('should copy the offence code to the clipboard', () => {
    const labelElement = document.createElement('span');
    const liveRegion = document.createElement('span');

    component.copyCodeToClipboard(labelElement, liveRegion, '1234');

    expect(utilsService.copyToClipboard).toHaveBeenCalledWith('1234');
  });

  it('should preserve the hidden offence code when a rendered copy button is clicked and reset', () => {
    vi.useFakeTimers();

    const buttonElement = fixture.nativeElement.querySelector('td#actions button') as HTMLButtonElement;

    const hiddenCodeElement = buttonElement.querySelector('.govuk-visually-hidden') as HTMLSpanElement;

    const liveRegion = fixture.nativeElement.querySelector(
      'td#actions > span.govuk-visually-hidden[aria-live]',
    ) as HTMLSpanElement;

    buttonElement.click();
    fixture.detectChanges();

    expect(utilsService.copyToClipboard).toHaveBeenCalledWith(
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_TABLE_DATA_MOCK[0].Code,
    );

    expect(liveRegion.textContent).toBe(
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS.COPIED_CODE_TO_CLIPBOARD,
    );

    expect(hiddenCodeElement).toBeTruthy();
    expect(hiddenCodeElement.textContent?.trim()).toBe(
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_TABLE_DATA_MOCK[0].Code,
    );

    vi.advanceTimersByTime(
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS.COPY_CODE_TO_CLIPBOARD_TIMEOUT,
    );
    fixture.detectChanges();

    expect(liveRegion.textContent).toBe('');
    expect(buttonElement.querySelector('.govuk-visually-hidden')).toBeTruthy();
    expect(buttonElement.querySelector('.govuk-visually-hidden')?.textContent?.trim()).toBe(
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_TABLE_DATA_MOCK[0].Code,
    );
  });

  it('should clear the copyCodeTimeoutId on ngOnDestroy if timeout is set', () => {
    vi.useFakeTimers();
    component['copyCodeTimeoutId'] = setTimeout(() => {}, 1000);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(window, 'clearTimeout');

    component.ngOnDestroy();

    expect(window.clearTimeout).toHaveBeenCalledWith(expect.anything());
    expect(component['copyCodeTimeoutId']).not.toBeNull(); // The property is set to null inside the timeout, not here
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
