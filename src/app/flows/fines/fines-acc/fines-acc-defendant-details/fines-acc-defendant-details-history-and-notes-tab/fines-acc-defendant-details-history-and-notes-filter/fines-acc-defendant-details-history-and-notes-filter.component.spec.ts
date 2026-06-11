import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesAccDefendantDetailsHistoryAndNotesFilterComponent } from './fines-acc-defendant-details-history-and-notes-filter.component';
import { of } from 'rxjs';
import { FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_MOCK } from '../mocks/fines-acc-defendant-details-history-and-notes-filter-form.mock';

describe('FinesAccDefendantDetailsHistoryAndNotesFilterComponent', () => {
  let component: FinesAccDefendantDetailsHistoryAndNotesFilterComponent;
  let fixture: ComponentFixture<FinesAccDefendantDetailsHistoryAndNotesFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccDefendantDetailsHistoryAndNotesFilterComponent],
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

    fixture = TestBed.createComponent(FinesAccDefendantDetailsHistoryAndNotesFilterComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should emit filter values from the form component', () => {
    const emitSpy = vi.spyOn(component.filterApplied, 'emit');

    component.handleFilterSubmit(FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_MOCK);

    expect(emitSpy).toHaveBeenCalledWith(FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_MOCK);
  });

  it('should update unsaved changes state', () => {
    component.handleUnsavedChanges(true);

    expect(component.stateUnsavedChanges).toBe(true);
  });
});
