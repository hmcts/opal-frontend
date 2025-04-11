import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsReviewSummaryDateOfSentenceComponent } from './fines-mac-offence-details-review-summary-date-of-sentence.component';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';

describe('FinesMacOffenceDetailsReviewSummaryDateOfSentenceComponent', () => {
  let component: FinesMacOffenceDetailsReviewSummaryDateOfSentenceComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsReviewSummaryDateOfSentenceComponent>;
  let mockDateService: jasmine.SpyObj<DateService>;

  beforeEach(async () => {
    mockDateService = jasmine.createSpyObj(DateService, ['toFormat', 'getFromFormat']);

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsReviewSummaryDateOfSentenceComponent],
      providers: [{ provide: DateService, useValue: mockDateService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsReviewSummaryDateOfSentenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
