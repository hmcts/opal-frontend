import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsReviewSummaryOffenceComponent } from './fines-mac-offence-details-review-summary-offence.component';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { of } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { OPAL_FINES_OFFENCES_REF_DATA_SINGULAR_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data-singular.mock';

fdescribe('FinesMacOffenceDetailsReviewSummaryOffenceTitleComponent', () => {
  let component: FinesMacOffenceDetailsReviewSummaryOffenceComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsReviewSummaryOffenceComponent>;
  let mockOpalFinesService: Partial<OpalFines>;

  beforeEach(async () => {
    mockOpalFinesService = {
      getOffenceByCjsCode: jasmine
        .createSpy('getOffenceByCjsCode')
        .and.returnValue(of(OPAL_FINES_OFFENCES_REF_DATA_SINGULAR_MOCK)),
    };

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsReviewSummaryOffenceComponent],
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsReviewSummaryOffenceComponent);
    component = fixture.componentInstance;

    component.offenceId = 0;
    component.offenceCode = '314441';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch offence reference data', () => {
    component['getOffenceRefData']();

    expect(mockOpalFinesService.getOffenceByCjsCode).toHaveBeenCalledWith(component.offenceCode);
    component.offenceRefData$.subscribe((result) => {
      expect(result).toEqual(OPAL_FINES_OFFENCES_REF_DATA_SINGULAR_MOCK);
    });
  });

  it('should emit actionClicked event with correct parameters', () => {
    const action = 'Change';
    const emittedValue = { actionName: action, offenceId: component.offenceId };
    const emitSpy = spyOn(component.actionClicked, 'emit');

    component.onActionClick(action);

    expect(emitSpy).toHaveBeenCalledWith(emittedValue);
  });
});
