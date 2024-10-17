import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsReviewSummaryOffenceTitleComponent } from './fines-mac-offence-details-review-summary-offence-title.component';
import { OPAL_FINES_OFFENCES_REF_DATA_SINGULAR_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data-singular.mock';

describe('FinesMacOffenceDetailsReviewSummaryOffenceTitleComponent', () => {
  let component: FinesMacOffenceDetailsReviewSummaryOffenceTitleComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsReviewSummaryOffenceTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsReviewSummaryOffenceTitleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsReviewSummaryOffenceTitleComponent);
    component = fixture.componentInstance;

    component.offenceRefData = OPAL_FINES_OFFENCES_REF_DATA_SINGULAR_MOCK;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit action when onActionClick is called', () => {
    const action = 'Change';
    const emitSpy = spyOn(component.actionClicked, 'emit');

    component.onActionClick(action);

    expect(emitSpy).toHaveBeenCalledWith(action);
  });

  it('should set offenceTitle when getOffenceTitle is called', () => {
    component.getOffenceTitle();

    expect(component.offenceTitle).toEqual(component.offenceRefData.refData[0].offence_title);
  });
});
