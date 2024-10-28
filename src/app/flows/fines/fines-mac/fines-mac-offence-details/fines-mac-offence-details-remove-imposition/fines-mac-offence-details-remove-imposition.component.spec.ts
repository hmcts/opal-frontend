import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsRemoveImpositionComponent } from './fines-mac-offence-details-remove-imposition.component';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { UtilsService } from '@services/utils/utils.service';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { of } from 'rxjs';
import { FinesMacOffenceDetailsService } from '../services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK } from '../mocks/fines-mac-offence-details-draft-state.mock';
import { FINES_MAC_OFFENCE_DETAILS_IMPOSITION_FIELD_NAMES } from '../constants/fines-mac-offence-details-imposition-field-names.constant';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../routing/constants/fines-mac-offence-details-routing-paths.constant';
import { OPAL_FINES_RESULT_PRETTY_NAME_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-result-pretty-name.mock';
import { FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_MOCK } from '../mocks/fines-mac-offence-details-remove-imposition.mock';

fdescribe('FinesMacOffenceDetailsRemoveImpositionComponent', () => {
  let component: FinesMacOffenceDetailsRemoveImpositionComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsRemoveImpositionComponent>;
  let mockOpalFinesService: Partial<OpalFines>;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;
  let mockFinesMacOffenceDetailsService: jasmine.SpyObj<FinesMacOffenceDetailsService>;

  beforeEach(async () => {
    mockOpalFinesService = {
      getResults: jasmine.createSpy('getResults').and.returnValue(of(OPAL_FINES_RESULTS_REF_DATA_MOCK)),
      getResultPrettyName: jasmine.createSpy('getResults').and.returnValue(OPAL_FINES_RESULT_PRETTY_NAME_MOCK),
    };

    mockFinesMacOffenceDetailsService = jasmine.createSpyObj(FinesMacOffenceDetailsService, [
      'finesMacOffenceDetailsDraftState',
    ]);
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState = FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK;

    mockUtilsService = jasmine.createSpyObj(UtilsService, ['convertToMonetaryString']);

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsRemoveImpositionComponent],
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: FinesMacOffenceDetailsService, useValue: mockFinesMacOffenceDetailsService },
        { provide: UtilsService, useValue: mockUtilsService },
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

    fixture = TestBed.createComponent(FinesMacOffenceDetailsRemoveImpositionComponent);
    component = fixture.componentInstance;

    component.resultCode = OPAL_FINES_RESULTS_REF_DATA_MOCK;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have state and populate resultCodeData$', () => {
    expect(component['resultCodeData$']).not.toBeUndefined();
  });

  it('should update monetary string correctly', () => {
    const value = 150;
    const expectedMonetaryString = '£150.00';
    mockUtilsService.convertToMonetaryString.and.returnValue(expectedMonetaryString);

    const monetaryString = component['updateMonetaryString'](value);

    expect(monetaryString).toEqual(expectedMonetaryString);
  });

  it('should get imposition to be removed', () => {
    const { formArray, formArrayControls } = FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_MOCK;
    mockUtilsService.convertToMonetaryString.and.returnValue('£50.00');

    fixture.detectChanges();
    component['getImpositionToBeRemoved'](0, formArray, formArrayControls);

    expect(component.imposition).toEqual(OPAL_FINES_RESULT_PRETTY_NAME_MOCK);
    expect(component.creditor).toEqual('major');
    expect(component.amountImposedString).toEqual('£50.00');
    expect(component.amountPaidString).toEqual('£50.00');
    expect(component.balanceString).toEqual('£50.00');

    fixture.detectChanges();
    component['getImpositionToBeRemoved'](1, formArray, formArrayControls);

    expect(component.imposition).toEqual('Not provided');
    expect(component.creditor).toEqual('Not provided');
    expect(component.amountImposedString).toEqual('£0.00');
    expect(component.amountPaidString).toEqual('£0.00');
    expect(component.balanceString).toEqual('£0.00');
  });

  it('should confirm removal and update form data', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'removeControlAndRenumber');
    spyOn(component, 'handleRoute');
    const { rowIndex, formArray } = FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_MOCK;
    fixture.detectChanges();

    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState = FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK;
    component.confirmRemoval(rowIndex, formArray);

    expect(component['removeControlAndRenumber']).toHaveBeenCalledWith(
      formArray,
      rowIndex,
      FINES_MAC_OFFENCE_DETAILS_IMPOSITION_FIELD_NAMES.fieldNames,
      FINES_MAC_OFFENCE_DETAILS_IMPOSITION_FIELD_NAMES.dynamicFieldPrefix,
    );
    expect(component.handleRoute).toHaveBeenCalledWith(FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addOffence);
  });
});
