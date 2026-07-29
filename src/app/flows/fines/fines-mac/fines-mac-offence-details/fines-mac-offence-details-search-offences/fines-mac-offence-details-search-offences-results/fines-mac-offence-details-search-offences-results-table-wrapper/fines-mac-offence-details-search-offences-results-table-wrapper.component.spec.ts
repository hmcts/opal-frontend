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

  it('should render a unique visually hidden code for each copy link', () => {
    const copyLinks = fixture.nativeElement.querySelectorAll('td#code a.govuk-link.govuk-link--no-visited-state');

    expect(copyLinks).toHaveLength(
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_TABLE_DATA_MOCK.length,
    );

    copyLinks.forEach((link: HTMLAnchorElement, index: number) => {
      expect(link.textContent).toContain(
        FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS.COPY_CODE_TO_CLIPBOARD,
      );
      expect(link.querySelector('.govuk-visually-hidden')?.textContent?.trim()).toBe(
        FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_TABLE_DATA_MOCK[index].Code,
      );
    });
  });

  it('should prevent default and copy to clipboard when copyCodeToClipboard is called with an event', () => {
    const event = new Event('click');
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    const linkElement = document.createElement('a');
    const labelElement = document.createElement('span');
    const liveRegion = document.createElement('span');

    component.copyCodeToClipboard(linkElement, labelElement, liveRegion, '1234', event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(utilsService.copyToClipboard).toHaveBeenCalledWith('1234');
  });

  it('should preserve the hidden offence code when a rendered copy link is clicked and reset', () => {
    vi.useFakeTimers();
    const linkElement = fixture.nativeElement.querySelector(
      'td#code a.govuk-link.govuk-link--no-visited-state',
    ) as HTMLAnchorElement;
    const hiddenCodeElement = linkElement.querySelector('.govuk-visually-hidden') as HTMLSpanElement;
    const liveRegion = fixture.nativeElement.querySelector('td#code > span.govuk-visually-hidden[aria-live]') as HTMLSpanElement;

    linkElement.click();
    fixture.detectChanges();

    expect(utilsService.copyToClipboard).toHaveBeenCalledWith(
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_TABLE_DATA_MOCK[0].Code,
    );
    expect(linkElement.getAttribute('aria-live')).toBe('assertive');
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

    expect(linkElement.hasAttribute('aria-live')).toBe(false);
    expect(liveRegion.textContent).toBe('');
    expect(linkElement.querySelector('.govuk-visually-hidden')).toBeTruthy();
    expect(linkElement.querySelector('.govuk-visually-hidden')?.textContent?.trim()).toBe(
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_TABLE_DATA_MOCK[0].Code,
    );
  });

  it('should restore original aria-live if it was present', () => {
    vi.useFakeTimers();
    const linkElement = document.createElement('a');
    const labelElement = document.createElement('span');
    const liveRegion = document.createElement('span');
    labelElement.innerText =
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS.COPY_CODE_TO_CLIPBOARD;
    linkElement.setAttribute('aria-live', 'polite');

    component.copyCodeToClipboard(linkElement, labelElement, liveRegion, '5678');

    expect(linkElement.getAttribute('aria-live')).toBe('assertive');

    vi.advanceTimersByTime(
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS.COPY_CODE_TO_CLIPBOARD_TIMEOUT,
    );

    expect(linkElement.getAttribute('aria-live')).toBe('polite');
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
