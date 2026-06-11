import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesAccDefendantDetailsHistoryAndNotesTabComponent } from './fines-acc-defendant-details-history-and-notes-tab.component';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-history-and-notes-tab-ref-data.mock';
import { of } from 'rxjs';
import { FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_MOCK } from './mocks/fines-acc-defendant-details-history-and-notes-filter-form.mock';

describe('FinesAccDefendantDetailsHistoryAndNotesTabComponent', () => {
  let component: FinesAccDefendantDetailsHistoryAndNotesTabComponent;
  let fixture: ComponentFixture<FinesAccDefendantDetailsHistoryAndNotesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccDefendantDetailsHistoryAndNotesTabComponent],
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

    fixture = TestBed.createComponent(FinesAccDefendantDetailsHistoryAndNotesTabComponent);
    component = fixture.componentInstance;
    component.tabData = OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK;
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should emit filter values from the filter component', () => {
    const emitSpy = vi.spyOn(component.filterApplied, 'emit');

    component.handleFilterApplied(FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_MOCK);

    expect(emitSpy).toHaveBeenCalledWith(FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_MOCK);
  });
});
