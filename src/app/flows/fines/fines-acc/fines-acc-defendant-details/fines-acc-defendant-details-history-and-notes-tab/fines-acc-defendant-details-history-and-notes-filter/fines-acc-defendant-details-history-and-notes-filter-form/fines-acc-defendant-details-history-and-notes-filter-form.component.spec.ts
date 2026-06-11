import { ComponentFixture, TestBed } from '@angular/core/testing';
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

    component['setInputValue']('01/01/2024', 'dateFrom');
    component['setInputValue']('31/01/2024', 'dateTo');
    component.getCategoryControl('amendments').setValue(true);
    component.getCategoryControl('notes').setValue(true);

    expect(emitSpy).not.toHaveBeenCalled();

    component.handleFormSubmit(new SubmitEvent('submit'));

    expect(emitSpy).toHaveBeenCalledWith(FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_MOCK);
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
