import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsReviewSummaryComponent } from './fines-mac-offence-details-review-summary.component';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_FORM_MOCK } from '../mocks/fines-mac-offence-details-review-summary-form.mock';
import { FinesMacOffenceDetailsService } from '../../services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../../routing/constants/fines-mac-offence-details-routing-paths.constant';
import { of } from 'rxjs';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_MAC_ROUTING_PATHS } from '../../../routing/constants/fines-mac-routing-paths';

describe('FinesMacOffenceDetailsReviewSummaryComponent', () => {
  let component: FinesMacOffenceDetailsReviewSummaryComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsReviewSummaryComponent>;
  let mockFinesMacOffenceDetailsService: jasmine.SpyObj<FinesMacOffenceDetailsService>;

  beforeEach(async () => {
    mockFinesMacOffenceDetailsService = jasmine.createSpyObj(FinesMacOffenceDetailsService, [
      'addedOffenceCode',
      'offenceIndex',
    ]);
    mockFinesMacOffenceDetailsService.addedOffenceCode = 'AK123456';

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsReviewSummaryComponent],
      providers: [
        { provide: FinesMacOffenceDetailsService, useValue: mockFinesMacOffenceDetailsService },
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('offence-details'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsReviewSummaryComponent);
    component = fixture.componentInstance;

    component.impositionRefData = OPAL_FINES_RESULTS_REF_DATA_MOCK;
    component.majorCreditorRefData = OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK;
    component.offencesImpositions = FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_FORM_MOCK;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the newlyAddedOffenceCode when addedOffenceCode is not empty', () => {
    component['getNewlyAddedOffenceCode']();

    expect(component.newlyAddedOffenceCode).toBe(
      `Offence ${component['finesMacOffenceDetailsService'].addedOffenceCode} added`,
    );
  });

  it('should set the newlyAddedOffenceCode to an empty string when addedOffenceCode is empty', () => {
    component['finesMacOffenceDetailsService'].addedOffenceCode = '';

    component['getNewlyAddedOffenceCode']();

    expect(component.newlyAddedOffenceCode).toBe('');
  });

  it('should return the maximum offence ID', () => {
    const result = component['getMaxOffenceId']();

    expect(result).toBe(1);
  });

  it('should return 0 if offencesImpositions is empty', () => {
    component.offencesImpositions = [];

    const result = component['getMaxOffenceId']();

    expect(result).toBe(0);
  });

  it('should set the offenceIndex and navigate to addOffence route when actionName is "Change"', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const action = { actionName: 'change', offenceId: 1 };

    component.offenceAction(action);

    expect(mockFinesMacOffenceDetailsService.offenceIndex).toBe(action.offenceId);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addOffence], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should not set the offenceIndex and navigate to addOffence route when actionName is not "Change"', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const action = { actionName: 'remove', offenceId: 1 };

    component.offenceAction(action);

    expect(mockFinesMacOffenceDetailsService.offenceIndex).not.toHaveBeenCalled();
    expect(routerSpy).not.toHaveBeenCalled();
  });

  it('should set the offenceIndex and navigate to addOffence route when addAnotherOffence is called', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const maxOffenceId = component['getMaxOffenceId']();
    const expectedOffenceIndex = maxOffenceId + 1;

    component.addAnotherOffence();

    expect(mockFinesMacOffenceDetailsService.offenceIndex).toBe(expectedOffenceIndex);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addOffence], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should navigate to relative route with event', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const event = jasmine.createSpyObj('event', ['preventDefault']);

    component.handleRoute('test', true, event);

    expect(routerSpy).toHaveBeenCalledWith([`${FINES_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.root}/test`]);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should test ngOnInit when offencesImpositions is empty', () => {
    const addAnotherOffenceSpy = spyOn(component, 'addAnotherOffence');
    component.offencesImpositions = [];

    component.ngOnInit();

    expect(addAnotherOffenceSpy).toHaveBeenCalled();
  });
});
