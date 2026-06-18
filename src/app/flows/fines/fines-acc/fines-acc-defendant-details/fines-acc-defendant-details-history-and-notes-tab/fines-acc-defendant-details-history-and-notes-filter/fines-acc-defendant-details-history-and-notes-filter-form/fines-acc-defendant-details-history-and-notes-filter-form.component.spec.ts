import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesAccDefendantDetailsHistoryAndNotesFilterFormComponent } from './fines-acc-defendant-details-history-and-notes-filter-form.component';
import { of } from 'rxjs';
import { FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_FIELD_ERRORS } from '../../constants/fines-acc-defendant-details-history-and-notes-filter-field-errors.constant';
import { FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_MOCK } from '../../mocks/fines-acc-defendant-details-history-and-notes-filter-form.mock';

describe('FinesAccDefendantDetailsHistoryAndNotesFilterFormComponent', () => {
  let component: FinesAccDefendantDetailsHistoryAndNotesFilterFormComponent;
  let fixture: ComponentFixture<FinesAccDefendantDetailsHistoryAndNotesFilterFormComponent>;

  beforeEach(async () => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

    await TestBed.configureTestingModule({
      imports: [FinesAccDefendantDetailsHistoryAndNotesFilterFormComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('details'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDefendantDetailsHistoryAndNotesFilterFormComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show hide filter text when the filter details are open', () => {
    fixture.detectChanges();

    const detailsElement = fixture.nativeElement.querySelector('details') as HTMLDetailsElement;
    detailsElement.open = true;
    detailsElement.dispatchEvent(new Event('toggle'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.govuk-details__summary-text').textContent.trim()).toBe('Hide filter');
  });

  it('should show show filter text when the filter details are closed', () => {
    fixture.detectChanges();

    const detailsElement = fixture.nativeElement.querySelector('details') as HTMLDetailsElement;
    detailsElement.open = true;
    detailsElement.dispatchEvent(new Event('toggle'));
    fixture.detectChanges();

    detailsElement.open = false;
    detailsElement.dispatchEvent(new Event('toggle'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.govuk-details__summary-text').textContent.trim()).toBe('Show filter');
  });

  it('should emit selected filter values only when the filter is submitted', () => {
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component['formSubmit'], 'emit');
    const openEmitSpy = vi.spyOn(component.filterOpenChange, 'emit');
    const submitEvent = new SubmitEvent('submit');
    const preventDefaultSpy = vi.spyOn(submitEvent, 'preventDefault');

    component['setInputValue']('01/01/2024', 'dateFrom');
    component['setInputValue']('31/01/2024', 'dateTo');
    component.getCategoryControl('amendments').setValue(true);
    component.getCategoryControl('notes').setValue(true);

    expect(emitSpy).not.toHaveBeenCalled();

    component.handleFormSubmit(submitEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(openEmitSpy).toHaveBeenCalledWith(true);
    expect(emitSpy).toHaveBeenCalledWith(FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_MOCK);
  });

  it('should populate submitted filter values and keep the filter details open after redraw', () => {
    component.filterForm = FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_MOCK;
    component.filterOpen = true;

    fixture.detectChanges();

    const detailsElement = fixture.nativeElement.querySelector('details') as HTMLDetailsElement;

    expect(detailsElement.open).toBe(true);
    expect(fixture.nativeElement.querySelector('.govuk-details__summary-text').textContent.trim()).toBe('Hide filter');
    expect(component.dateFromControl.value).toBe('01/01/2024');
    expect(component.dateToControl.value).toBe('31/01/2024');
    expect(component.getCategoryControl('amendments').value).toBe(true);
    expect(component.getCategoryControl('notes').value).toBe(true);
  });

  it('should patch submitted filter values when filter form input changes after initial render', () => {
    fixture.detectChanges();

    component.filterForm = FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_MOCK;
    component.ngOnChanges({
      filterForm: new SimpleChange(null, component.filterForm, false),
    });

    expect(component.dateFromControl.value).toBe('01/01/2024');
    expect(component.dateToControl.value).toBe('31/01/2024');
    expect(component.getCategoryControl('amendments').value).toBe(true);
    expect(component.getCategoryControl('notes').value).toBe(true);
  });

  it('should handle details setup when the rendered details element is unavailable', () => {
    const querySelectorSpy = vi.fn().mockReturnValue(null);

    Object.defineProperty(component, 'filterDetails', {
      value: {
        nativeElement: {
          querySelector: querySelectorSpy,
        },
      },
    });

    component.ngAfterViewInit();

    expect(querySelectorSpy).toHaveBeenCalledWith('details');
    expect(component.filterDetailsSummaryText()).toBe('Show filter');
  });

  it('should show an error and not emit when date from is after date to', () => {
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component['formSubmit'], 'emit');

    component['setInputValue']('02/01/2024', 'dateFrom');
    component['setInputValue']('01/01/2024', 'dateTo');

    component.handleFormSubmit(new SubmitEvent('submit'));

    expect(component.dateToControl.hasError('dateNotBefore')).toBe(true);
    expect(component.formControlErrorMessages['dateTo']).toBe(
      FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_FIELD_ERRORS.dateTo['dateNotBefore'].message,
    );
    expect(component.formErrorSummaryMessage).toContainEqual({
      fieldId: 'dateTo',
      message: FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_FIELD_ERRORS.dateTo['dateNotBefore'].message,
    });
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should not parse date from when date from is empty', () => {
    fixture.detectChanges();

    const dateService = TestBed.inject(DateService);
    const getDateFromFormatSpy = vi.spyOn(dateService, 'getDateFromFormat');

    component.dateFromControl.setValue(null);

    expect(getDateFromFormatSpy).not.toHaveBeenCalled();
  });
});
