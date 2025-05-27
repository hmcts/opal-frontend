import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent } from './fines-mac-offence-details-search-offences-results-table-wrapper.component';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import {
  COPIED_CODE_TO_CLIPBOARD,
  COPY_CODE_TO_CLIPBOARD,
  COPY_CODE_TO_CLIPBOARD_TIMEOUT,
} from './constants/fines-mac-offence-details-search-offences-results-table-wrapper-link-defaults.constant';

describe('FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent', () => {
  let component: FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent>;
  let utilsService: jasmine.SpyObj<UtilsService>;

  beforeEach(async () => {
    utilsService = jasmine.createSpyObj('UtilsService', ['copyToClipboard']);

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent],
      providers: [{ provide: UtilsService, useValue: utilsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update link and live region, then revert after timeout', fakeAsync(() => {
    fixture = TestBed.createComponent(FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent);
    component = fixture.componentInstance;

    const linkElement = document.createElement('a');
    const liveRegion = document.createElement('span');
    linkElement.innerText = COPY_CODE_TO_CLIPBOARD;

    component.copyCodeToClipboard(linkElement, liveRegion, '1234');

    expect(utilsService.copyToClipboard).toHaveBeenCalledWith('1234');

    expect(linkElement.innerText).toBe(COPIED_CODE_TO_CLIPBOARD);
    expect(linkElement.getAttribute('aria-live')).toBe('assertive');
    expect(liveRegion.textContent).toBe(COPIED_CODE_TO_CLIPBOARD);

    tick(COPY_CODE_TO_CLIPBOARD_TIMEOUT);

    expect(linkElement.innerText).toBe(COPY_CODE_TO_CLIPBOARD);
    expect(linkElement.hasAttribute('aria-live')).toBeFalse();
    expect(liveRegion.textContent).toBe('');
  }));

  it('should restore original aria-live if it was present', fakeAsync(() => {
    fixture = TestBed.createComponent(FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent);
    component = fixture.componentInstance;

    const linkElement = document.createElement('a');
    const liveRegion = document.createElement('span');
    linkElement.innerText = COPY_CODE_TO_CLIPBOARD;
    linkElement.setAttribute('aria-live', 'polite');

    component.copyCodeToClipboard(linkElement, liveRegion, '5678');

    expect(linkElement.getAttribute('aria-live')).toBe('assertive');
    tick(COPY_CODE_TO_CLIPBOARD_TIMEOUT);

    expect(linkElement.getAttribute('aria-live')).toBe('polite');
  }));

  it('should clear the copyCodeTimeoutId on ngOnDestroy if timeout is set', () => {
    component['copyCodeTimeoutId'] = setTimeout(() => {}, 1000);
    spyOn(window, 'clearTimeout');
    component.ngOnDestroy();
    expect(window.clearTimeout).toHaveBeenCalledWith(jasmine.any(Number));
    expect(component['copyCodeTimeoutId']).not.toBeNull(); // The property is set to null inside the timeout, not here
  });

  it('should not call clearTimeout on ngOnDestroy if copyCodeTimeoutId is null', () => {
    component['copyCodeTimeoutId'] = null;
    spyOn(window, 'clearTimeout');
    component.ngOnDestroy();
    expect(window.clearTimeout).not.toHaveBeenCalled();
  });
});
