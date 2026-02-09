import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent } from './fines-mac-offence-details-search-offences-results-table-wrapper.component';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS } from './constants/fines-mac-offence-details-search-offences-results-table-wrapper-link-defaults.constant';
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

  it('should update link and live region, then revert after timeout', () => {
    vi.useFakeTimers();
    fixture = TestBed.createComponent(FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent);
    component = fixture.componentInstance;

    const linkElement = document.createElement('a');
    const liveRegion = document.createElement('span');
    linkElement.innerText =
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS.COPY_CODE_TO_CLIPBOARD;

    component.copyCodeToClipboard(linkElement, liveRegion, '1234');

    expect(utilsService.copyToClipboard).toHaveBeenCalledWith('1234');

    expect(linkElement.innerText).toBe(
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS.COPIED_CODE_TO_CLIPBOARD,
    );
    expect(linkElement.getAttribute('aria-live')).toBe('assertive');
    expect(liveRegion.textContent).toBe(
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS.COPIED_CODE_TO_CLIPBOARD,
    );

    vi.advanceTimersByTime(
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS.COPY_CODE_TO_CLIPBOARD_TIMEOUT,
    );

    expect(linkElement.innerText).toBe(
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS.COPY_CODE_TO_CLIPBOARD,
    );
    expect(linkElement.hasAttribute('aria-live')).toBe(false);
    expect(liveRegion.textContent).toBe('');
  });

  it('should restore original aria-live if it was present', () => {
    vi.useFakeTimers();
    fixture = TestBed.createComponent(FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent);
    component = fixture.componentInstance;

    const linkElement = document.createElement('a');
    const liveRegion = document.createElement('span');
    linkElement.innerText =
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS.COPY_CODE_TO_CLIPBOARD;
    linkElement.setAttribute('aria-live', 'polite');

    component.copyCodeToClipboard(linkElement, liveRegion, '5678');

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
