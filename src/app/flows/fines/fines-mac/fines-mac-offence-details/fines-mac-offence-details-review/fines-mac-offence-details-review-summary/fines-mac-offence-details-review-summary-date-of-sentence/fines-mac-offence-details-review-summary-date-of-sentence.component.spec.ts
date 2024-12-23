import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsReviewSummaryDateOfSentenceComponent } from './fines-mac-offence-details-review-summary-date-of-sentence.component';
import { DateService } from '@services/date-service/date.service';

describe('FinesMacOffenceDetailsReviewSummaryDateOfSentenceComponent', () => {
  let component: FinesMacOffenceDetailsReviewSummaryDateOfSentenceComponent | null;
  let fixture: ComponentFixture<FinesMacOffenceDetailsReviewSummaryDateOfSentenceComponent> | null;
  let mockDateService: jasmine.SpyObj<DateService> | null;

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

  afterAll(() => {
    component = null;
    fixture = null;
    mockDateService = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
