import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsReviewOffenceHeadingComponent } from './fines-mac-offence-details-review-offence-heading.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { OPAL_FINES_OFFENCES_REF_DATA_SINGULAR_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data-singular.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { of } from 'rxjs';

describe('FinesMacOffenceDetailsReviewOffenceHeadingComponent', () => {
  let component: FinesMacOffenceDetailsReviewOffenceHeadingComponent | null;
  let fixture: ComponentFixture<FinesMacOffenceDetailsReviewOffenceHeadingComponent> | null;
  let mockOpalFinesService: Partial<OpalFines> | null;

  beforeEach(async () => {
    mockOpalFinesService = {
      getOffenceByCjsCode: jasmine
        .createSpy('getOffenceByCjsCode')
        .and.returnValue(of(OPAL_FINES_OFFENCES_REF_DATA_SINGULAR_MOCK)),
    };

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsReviewOffenceHeadingComponent],
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsReviewOffenceHeadingComponent);
    component = fixture.componentInstance;

    component.offenceId = 0;
    component.offenceCode = '314441';

    fixture.detectChanges();
  });

  afterAll(() => {
    component = null;
    fixture = null;
    mockOpalFinesService = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch offence reference data', () => {
    if (!component || !mockOpalFinesService) {
      fail('Required properties not properly initialised');
      return;
    }

    component['getOffenceRefData']();

    expect(mockOpalFinesService.getOffenceByCjsCode).toHaveBeenCalledWith(component.offenceCode);
    component.offenceRefData$.subscribe((result) => {
      expect(result).toEqual(OPAL_FINES_OFFENCES_REF_DATA_SINGULAR_MOCK);
    });
  });

  it('should emit actionClicked event with correct parameters', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    const action = 'Change';
    const emittedValue = { actionName: action, offenceId: component.offenceId };
    const emitSpy = spyOn(component.actionClicked, 'emit');

    component.onActionClick(action);

    expect(emitSpy).toHaveBeenCalledWith(emittedValue);
  });
});
