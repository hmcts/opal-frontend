import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacCourtDetailsFormComponent } from './fines-mac-court-details-form.component';
import { IFinesMacCourtDetailsForm } from '../interfaces/fines-mac-court-details-form.interface';
import { FINES_MAC_STATE_MOCK } from '../../mocks/fines-mac-state.mock';
import { OPAL_FINES_COURT_AUTOCOMPLETE_ITEMS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-court-autocomplete-items.mock';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_AUTOCOMPLETE_ITEMS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-local-justice-area-autocomplete-items.mock';
import { FINES_MAC_COURT_DETAILS_FORM_MOCK } from '../mocks/fines-mac-court-details-form.mock';
import { ActivatedRoute } from '@angular/router';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-local-justice-area-ref-data.mock';
import { FinesMacStoreType } from '../../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../../stores/fines-mac.store';

describe('FinesMacCourtDetailsFormComponent', () => {
  let component: FinesMacCourtDetailsFormComponent;
  let fixture: ComponentFixture<FinesMacCourtDetailsFormComponent>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let formSubmit: IFinesMacCourtDetailsForm;
  let finesMacStore: FinesMacStoreType;

  beforeEach(async () => {
    formSubmit = { ...FINES_MAC_COURT_DETAILS_FORM_MOCK };

    await TestBed.configureTestingModule({
      imports: [FinesMacCourtDetailsFormComponent],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacCourtDetailsFormComponent);
    component = fixture.componentInstance;

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(FINES_MAC_STATE_MOCK);

    component.defendantType = 'adultOrYouthOnly';
    component.localJusticeAreas = OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK;
    component.sendingCourtAutoCompleteItems = OPAL_FINES_LOCAL_JUSTICE_AREA_AUTOCOMPLETE_ITEMS_MOCK;
    component.enforcingCourtAutoCompleteItems = OPAL_FINES_COURT_AUTOCOMPLETE_ITEMS_MOCK;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit form submit event with form value', () => {
    const event = {} as SubmitEvent;
    formSubmit.nestedFlow = false;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        formData: formSubmit.formData,
        nestedFlow: false,
      }),
    );
  });

  it('should emit form submit event with form value', () => {
    const event = { submitter: { className: 'nested-flow' } } as SubmitEvent;
    formSubmit.nestedFlow = true;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        formData: formSubmit.formData,
        nestedFlow: true,
      }),
    );
  });

  it('should get originator name based on originator ID', () => {
    const originatorName = component['getOriginatorName']('9985');
    expect(originatorName).toBe('Asylum & Immigration Tribunal');
  });

  it('should return empty string if originator ID is not found', () => {
    const originatorName = component['getOriginatorName']('999');
    expect(originatorName).toBe('');
  });

  it('should set originator name based on sending court details', () => {
    component['setupCourtDetailsForm']();
    component.form.get('fm_court_details_originator_id')?.setValue('9985');
    component['setOriginatorName']();
    expect(component.form.get('fm_court_details_originator_name')?.value).toBe('Asylum & Immigration Tribunal');
  });
});
