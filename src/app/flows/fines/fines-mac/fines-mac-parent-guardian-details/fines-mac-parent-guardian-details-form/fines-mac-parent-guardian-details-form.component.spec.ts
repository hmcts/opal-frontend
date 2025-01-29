import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacParentGuardianDetailsFormComponent } from './fines-mac-parent-guardian-details-form.component';
import { IFinesMacParentGuardianDetailsForm } from '../interfaces/fines-mac-parent-guardian-details-form.interface';
import { FINES_MAC_STATE_MOCK } from '../../mocks/fines-mac-state.mock';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_FORM_MOCK } from '../mocks/fines-mac-parent-guardian-details-form.mock';
import { ActivatedRoute } from '@angular/router';
import { DateService } from '@services/date-service/date.service';
import { FinesMacStoreType } from '../../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { UtilsService } from '@services/utils/utils.service';

describe('FinesMacParentGuardianDetailsFormComponent', () => {
  let component: FinesMacParentGuardianDetailsFormComponent;
  let fixture: ComponentFixture<FinesMacParentGuardianDetailsFormComponent>;
  let mockDateService: jasmine.SpyObj<DateService>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let formSubmit: IFinesMacParentGuardianDetailsForm;
  let finesMacStore: FinesMacStoreType;

  beforeEach(async () => {
    mockDateService = jasmine.createSpyObj(DateService, ['getPreviousDate', 'getDateFromFormat']);
    mockDateService.getPreviousDate.and.returnValue('19/08/2024');
    formSubmit = structuredClone(FINES_MAC_PARENT_GUARDIAN_DETAILS_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacParentGuardianDetailsFormComponent],
      providers: [
        { provide: DateService, useValue: mockDateService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        {
          provide: UtilsService,
          useValue: jasmine.createSpyObj(UtilsService, ['checkFormValues', 'checkFormArrayValues']),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacParentGuardianDetailsFormComponent);
    component = fixture.componentInstance;

    const finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    finesMacState.accountDetails.formData = {
      ...structuredClone(FINES_MAC_STATE_MOCK.accountDetails.formData),
      fm_create_account_defendant_type: 'parentOrGuardianToPay',
    };

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(finesMacState);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit form submit event with form value', () => {
    spyOn(component['formSubmit'], 'emit');
    const event = { submitter: { className: 'nested-flow' } } as SubmitEvent;

    formSubmit.nestedFlow = true;
    component['rePopulateForm'](formSubmit.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        formData: formSubmit.formData,
        nestedFlow: true,
      }),
    );
  });

  it('should emit form submit event with form value', () => {
    spyOn(component['formSubmit'], 'emit');
    const event = {} as SubmitEvent;

    formSubmit.nestedFlow = false;
    component['rePopulateForm'](formSubmit.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        formData: formSubmit.formData,
        nestedFlow: false,
      }),
    );
  });
});
