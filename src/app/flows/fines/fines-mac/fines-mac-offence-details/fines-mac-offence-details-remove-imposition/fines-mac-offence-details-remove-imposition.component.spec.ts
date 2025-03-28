import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsRemoveImpositionComponent } from './fines-mac-offence-details-remove-imposition.component';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { of } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK } from '../mocks/fines-mac-offence-details-draft-state.mock';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../routing/constants/fines-mac-offence-details-routing-paths.constant';
import { OPAL_FINES_RESULT_PRETTY_NAME_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-result-pretty-name.mock';
import { FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK } from '../fines-mac-offence-details-minor-creditor/mocks/fines-mac-offence-details-minor-creditor-form.mock';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { OPAL_FINES_MAJOR_CREDITOR_PRETTY_NAME_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-pretty-name.mock';
import { FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_DEFAULTS } from './constants/fines-mac-offence-details-remove-imposition-defaults';
import { FinesMacOffenceDetailsStoreType } from '../stores/types/fines-mac-offence-details.type';
import { FinesMacOffenceDetailsStore } from '../stores/fines-mac-offence-details.store';
import { FINES_MAC_OFFENCE_DETAILS_FORM_MOCK } from '../mocks/fines-mac-offence-details-form.mock';
import { UtilsService } from '@hmcts/opal-frontend-common/core/services';

describe('FinesMacOffenceDetailsRemoveImpositionComponent', () => {
  let component: FinesMacOffenceDetailsRemoveImpositionComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsRemoveImpositionComponent>;
  let mockOpalFinesService: Partial<OpalFines>;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;
  let finesMacOffenceDetailsStore: FinesMacOffenceDetailsStoreType;

  beforeEach(async () => {
    mockOpalFinesService = {
      getResults: jasmine.createSpy('getResults').and.returnValue(of(OPAL_FINES_RESULTS_REF_DATA_MOCK)),
      getResultPrettyName: jasmine.createSpy('getResults').and.returnValue(OPAL_FINES_RESULT_PRETTY_NAME_MOCK),
      getMajorCreditors: jasmine
        .createSpy('getMajorCreditors')
        .and.returnValue(of(OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK)),
      getMajorCreditorPrettyName: jasmine
        .createSpy('getMajorCreditorPrettyName')
        .and.returnValue(OPAL_FINES_MAJOR_CREDITOR_PRETTY_NAME_MOCK),
    };

    mockUtilsService = jasmine.createSpyObj(UtilsService, ['convertToMonetaryString']);

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsRemoveImpositionComponent],
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
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

    finesMacOffenceDetailsStore = TestBed.inject(FinesMacOffenceDetailsStore);
    finesMacOffenceDetailsStore.setOffenceDetailsDraft(FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK.offenceDetailsDraft);
    finesMacOffenceDetailsStore.setRowIndex(0);
    finesMacOffenceDetailsStore.setRemoveMinorCreditor(FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK.removeMinorCreditor);

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
    finesMacOffenceDetailsStore.setOffenceDetailsDraft(FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK.offenceDetailsDraft);
    finesMacOffenceDetailsStore.setRowIndex(0);
    mockUtilsService.convertToMonetaryString.and.returnValue('£50.00');

    fixture.detectChanges();
    component['getImpositionToBeRemoved']();

    expect(component.imposition).toEqual(OPAL_FINES_RESULT_PRETTY_NAME_MOCK);
    expect(component.creditor).toEqual('major');
    expect(component.majorCreditor).toEqual(OPAL_FINES_MAJOR_CREDITOR_PRETTY_NAME_MOCK);
    expect(component.amountImposedString).toEqual('£50.00');
    expect(component.amountPaidString).toEqual('£50.00');
    expect(component.balanceString).toEqual('£50.00');

    finesMacOffenceDetailsStore.setOffenceDetailsDraft(FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK.offenceDetailsDraft);
    finesMacOffenceDetailsStore.setRowIndex(1);
    fixture.detectChanges();
    component['getImpositionToBeRemoved']();

    expect(component.imposition).toEqual(OPAL_FINES_RESULT_PRETTY_NAME_MOCK);
    expect(component.creditor).toEqual('Not provided');
    expect(component.amountImposedString).toEqual('£0.00');
    expect(component.amountPaidString).toEqual('£0.00');
    expect(component.balanceString).toEqual('£0.00');
  });

  it('should confirm removal and update form data', () => {
    spyOn(component, 'handleRoute');

    const offenceWithMinorCreditor = structuredClone(FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK.offenceDetailsDraft);
    offenceWithMinorCreditor[0].childFormData = [structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK)];

    finesMacOffenceDetailsStore.setOffenceDetailsDraft(offenceWithMinorCreditor);
    component.confirmRemoval();

    expect(component.handleRoute).toHaveBeenCalledWith(FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addOffence);
  });

  it('should not confirm removal as rowIndex is null', () => {
    spyOn(component, 'handleRoute');
    finesMacOffenceDetailsStore.setRowIndex(null);

    component.confirmRemoval();

    expect(component.handleRoute).not.toHaveBeenCalled();
  });

  it('should confirm removal and update form data', () => {
    spyOn(component, 'handleRoute');
    const offenceWithMinorCreditor = structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK);
    offenceWithMinorCreditor.childFormData = [
      {
        ...structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK),
        formData: {
          ...structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK.formData),
          fm_offence_details_imposition_position: 5,
        },
      },
    ];
    finesMacOffenceDetailsStore.setOffenceDetailsDraft([offenceWithMinorCreditor]);
    component.confirmRemoval();

    expect(component.handleRoute).toHaveBeenCalledWith(FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addOffence);
  });

  it('should return CPS default value', () => {
    expect(component['getDefaultCreditor']('CPS')).toEqual(
      FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_DEFAULTS.crownProsecutionServiceDefault,
    );
  });

  it('should return default value', () => {
    expect(component['getDefaultCreditor']('TEST')).toEqual(
      FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_DEFAULTS.stringDefault,
    );
  });

  it('should return company name of minor creditor', () => {
    const offenceWithMinorCreditors = structuredClone(FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK.offenceDetailsDraft);
    offenceWithMinorCreditors[0].childFormData = [
      {
        ...structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK),
        formData: {
          ...structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK.formData),
          fm_offence_details_minor_creditor_company_name: 'Test Company',
          fm_offence_details_imposition_position: 0,
          fm_offence_details_minor_creditor_creditor_type: 'company',
        },
      },
    ];
    finesMacOffenceDetailsStore.setOffenceDetailsDraft(offenceWithMinorCreditors);

    component['setMinorCreditorDetails'](0);

    expect(component.minorCreditor).toEqual('Test Company');
  });

  it('should return individual name of minor creditor', () => {
    const offenceWithMinorCreditors = structuredClone(FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK.offenceDetailsDraft);
    offenceWithMinorCreditors[0].childFormData = [
      {
        ...structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK),
        formData: {
          ...structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK.formData),

          fm_offence_details_minor_creditor_forenames: 'Joe',
          fm_offence_details_minor_creditor_surname: 'Bloggs',
          fm_offence_details_imposition_position: 0,
          fm_offence_details_minor_creditor_creditor_type: 'individual',
        },
      },
    ];
    finesMacOffenceDetailsStore.setOffenceDetailsDraft(offenceWithMinorCreditors);

    component['setMinorCreditorDetails'](0);

    expect(component.minorCreditor).toEqual('Joe Bloggs');
  });

  it('should return default value for result code', () => {
    const offence = structuredClone(FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK.offenceDetailsDraft);
    offence[0].formData.fm_offence_details_impositions[0] = {
      ...structuredClone(
        FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK.offenceDetailsDraft[0].formData.fm_offence_details_impositions[0],
      ),
      fm_offence_details_result_id: null,
      fm_offence_details_amount_imposed: null,
      fm_offence_details_amount_paid: null,
    };
    finesMacOffenceDetailsStore.setOffenceDetailsDraft(offence);

    component['getImpositionToBeRemoved']();

    expect(component.imposition).toEqual(FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_DEFAULTS.stringDefault);
    expect(component.amountImposedString).toEqual(FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_DEFAULTS.numberDefault);
    expect(component.amountPaidString).toEqual(FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_DEFAULTS.numberDefault);
  });
});
