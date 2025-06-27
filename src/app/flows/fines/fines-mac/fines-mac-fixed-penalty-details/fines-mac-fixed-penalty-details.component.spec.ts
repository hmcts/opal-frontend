import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacFixedPenaltyDetailsComponent } from './fines-mac-fixed-penalty-details.component';
import { FinesMacStore } from '../stores/fines-mac.store';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { FinesMacStoreType } from '../stores/types/fines-mac-store.type';
import { IFinesMacFixedPenaltyDetailsForm } from './interfaces/fines-mac-fixed-penalty-details-form.interface';
import { FINES_MAC_FIXED_PENALTY_DETAILS_FORM_MOCK } from './mocks/fines-mac-fixed-penalty-details-form.mock';
import { FINES_MAC_STATE_MOCK } from '../mocks/fines-mac-state.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_PROSECUTOR_PRETTY_NAME_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-prosecutor-pretty-name.mock';
import { OPAL_FINES_COURT_PRETTY_NAME_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-court-pretty-name.mock';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { OPAL_FINES_COURT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-court-ref-data.mock';
import { OPAL_FINES_OFFENCES_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data.mock';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths.constant';
import { OPAL_FINES_PROSECUTOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-prosecutor-ref-data.mock';
import { FINES_MAC_DEFENDANT_TYPES_KEYS } from '../constants/fines-mac-defendant-types-keys';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_PRETTY_NAME_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-local-justice-area-pretty-name.mock';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-local-justice-area-ref-data.mock';

describe('FinesMacFixedPenaltyDetailsComponent', () => {
  let component: FinesMacFixedPenaltyDetailsComponent;
  let fixture: ComponentFixture<FinesMacFixedPenaltyDetailsComponent>;
  let formSubmit: IFinesMacFixedPenaltyDetailsForm;
  let mockOpalFinesService: Partial<OpalFines>;
  let finesMacStore: FinesMacStoreType;

  beforeEach(async () => {
    mockOpalFinesService = {
      getProsecutorPrettyName: jasmine
        .createSpy('getProsecutorPrettyName')
        .and.returnValue(OPAL_FINES_PROSECUTOR_PRETTY_NAME_MOCK),
      getCourtPrettyName: jasmine.createSpy('getCourtPrettyName').and.returnValue(OPAL_FINES_COURT_PRETTY_NAME_MOCK),
      getLocalJusticeAreaPrettyName: jasmine
        .createSpy('getCourtPrettyName')
        .and.returnValue(OPAL_FINES_LOCAL_JUSTICE_AREA_PRETTY_NAME_MOCK),
      getOffenceByCjsCode: jasmine.createSpy('getOffenceByCjsCode').and.returnValue(OPAL_FINES_OFFENCES_REF_DATA_MOCK),
    };
    formSubmit = structuredClone(FINES_MAC_FIXED_PENALTY_DETAILS_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacFixedPenaltyDetailsComponent],
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
            snapshot: {
              data: {
                courts: OPAL_FINES_COURT_REF_DATA_MOCK,
                prosecutors: OPAL_FINES_PROSECUTOR_REF_DATA_MOCK,
                localJusticeAreas: OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK,
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacFixedPenaltyDetailsComponent);
    component = fixture.componentInstance;

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(FINES_MAC_STATE_MOCK);

    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handlefixedPenaltyDetailsSubmit and navigate to account details', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'routerNavigate');
    const finesMacStoreSpies = [
      spyOn(finesMacStore, 'setPersonalDetails'),
      spyOn(finesMacStore, 'setCourtDetails'),
      spyOn(finesMacStore, 'setAccountCommentsNotes'),
      spyOn(finesMacStore, 'setLanguagePreferences'),
      spyOn(finesMacStore, 'setFixedPenaltyDetails'),
    ];
    component.handleFixedPenaltyDetailsSubmit(formSubmit);
    expect(finesMacStoreSpies[0]).toHaveBeenCalled();
    expect(finesMacStoreSpies[1]).toHaveBeenCalled();
    expect(finesMacStoreSpies[2]).toHaveBeenCalled();
    expect(finesMacStoreSpies[3]).toHaveBeenCalled();
    expect(finesMacStoreSpies[4]).toHaveBeenCalled();
    expect(component['routerNavigate']).toHaveBeenCalledWith(FINES_MAC_ROUTING_PATHS.children.reviewAccount);
  });

  it('should handle unsaved changes', () => {
    spyOn(finesMacStore, 'setUnsavedChanges');
    const unsavedChanges = true;
    component.handleUnsavedChanges(unsavedChanges);
    expect(finesMacStore.setUnsavedChanges).toHaveBeenCalledWith(unsavedChanges);
    expect(component.stateUnsavedChanges).toBe(unsavedChanges);
  });

  it('should create personal details form for store', () => {
    const personalDetailsForm = component['createPersonalDetailsFormForStore'](formSubmit);
    expect(personalDetailsForm.formData['fm_personal_details_title']).toBe(
      formSubmit.formData['fm_fp_personal_details_title'],
    );
    expect(personalDetailsForm.formData['fm_personal_details_forenames']).toBe(
      formSubmit.formData['fm_fp_personal_details_forenames'],
    );
    expect(personalDetailsForm.formData['fm_personal_details_surname']).toBe(
      formSubmit.formData['fm_fp_personal_details_surname'],
    );
    expect(personalDetailsForm.formData['fm_personal_details_dob']).toBe(
      formSubmit.formData['fm_fp_personal_details_dob'],
    );
    expect(personalDetailsForm.formData['fm_personal_details_address_line_1']).toBe(
      formSubmit.formData['fm_fp_personal_details_address_line_1'],
    );
    expect(personalDetailsForm.formData['fm_personal_details_address_line_2']).toBe(
      formSubmit.formData['fm_fp_personal_details_address_line_2'],
    );
    expect(personalDetailsForm.formData['fm_personal_details_address_line_3']).toBe(
      formSubmit.formData['fm_fp_personal_details_address_line_3'],
    );
    expect(personalDetailsForm.formData['fm_personal_details_post_code']).toBe(
      formSubmit.formData['fm_fp_personal_details_post_code'],
    );
  });

  it('should create court details form for store', () => {
    const courtDetailsForm = component['createCourtDetailsFormForStore'](formSubmit);
    expect(courtDetailsForm.formData['fm_court_details_imposing_court_id']).toBe(
      formSubmit.formData['fm_fp_court_details_imposing_court_id'],
    );
  });

  it('should create comments and notes form for store', () => {
    const commentsAndNotesForm = component['createCommentsAndNotesFormForStore'](formSubmit);
    expect(commentsAndNotesForm.formData['fm_account_comments_notes_comments']).toBe(
      formSubmit.formData['fm_fp_account_comments_notes_comments'],
    );
    expect(commentsAndNotesForm.formData['fm_account_comments_notes_notes']).toBe(
      formSubmit.formData['fm_fp_account_comments_notes_notes'],
    );
    expect(commentsAndNotesForm.formData['fm_account_comments_notes_system_notes']).toBe(
      formSubmit.formData['fm_fp_account_comments_notes_system_notes'],
    );
  });

  it('should create language preferences form for store', () => {
    const languagePreferencesForm = component['createLanguagePreferencesFormForStore'](formSubmit);
    expect(languagePreferencesForm.formData['fm_language_preferences_document_language']).toBe(
      formSubmit.formData['fm_fp_language_preferences_document_language'],
    );
    expect(languagePreferencesForm.formData['fm_language_preferences_hearing_language']).toBe(
      formSubmit.formData['fm_fp_language_preferences_hearing_language'],
    );
  });

  it('should create fixed penalty details form for store', () => {
    const fixedPenaltyDetailsForm = component['createFixedPenaltyDetailsFormForStore'](formSubmit);
    expect(fixedPenaltyDetailsForm.formData['fm_offence_details_notice_number']).toBe(
      formSubmit.formData['fm_fp_offence_details_notice_number'],
    );
    expect(fixedPenaltyDetailsForm.formData['fm_offence_details_offence_type']).toBe(
      formSubmit.formData['fm_fp_offence_details_offence_type'],
    );
    expect(fixedPenaltyDetailsForm.formData['fm_offence_details_date_of_offence']).toBe(
      formSubmit.formData['fm_fp_offence_details_date_of_offence'],
    );
    expect(fixedPenaltyDetailsForm.formData['fm_offence_details_offence_id']).toBe(
      formSubmit.formData['fm_fp_offence_details_offence_id'],
    );
    expect(fixedPenaltyDetailsForm.formData['fm_offence_details_offence_cjs_code']).toBe(
      formSubmit.formData['fm_fp_offence_details_offence_cjs_code'],
    );
    expect(fixedPenaltyDetailsForm.formData['fm_offence_details_time_of_offence']).toBe(
      formSubmit.formData['fm_fp_offence_details_time_of_offence'],
    );
    expect(fixedPenaltyDetailsForm.formData['fm_offence_details_place_of_offence']).toBe(
      formSubmit.formData['fm_fp_offence_details_place_of_offence'],
    );
    expect(fixedPenaltyDetailsForm.formData['fm_offence_details_amount_imposed']).toBe(
      formSubmit.formData['fm_fp_offence_details_amount_imposed'],
    );
    expect(fixedPenaltyDetailsForm.formData['fm_offence_details_vehicle_registration_number']).toBe(
      formSubmit.formData['fm_fp_offence_details_vehicle_registration_number'],
    );
    expect(fixedPenaltyDetailsForm.formData['fm_offence_details_vehicle_registration_number']).toBe(
      formSubmit.formData['fm_fp_offence_details_vehicle_registration_number'],
    );
    expect(fixedPenaltyDetailsForm.formData['fm_offence_details_driving_licence_number']).toBe(
      formSubmit.formData['fm_fp_offence_details_driving_licence_number'],
    );
    expect(fixedPenaltyDetailsForm.formData['fm_offence_details_driving_licence_number']).toBe(
      formSubmit.formData['fm_fp_offence_details_driving_licence_number'],
    );
    expect(fixedPenaltyDetailsForm.formData['fm_offence_details_nto_nth']).toBe(
      formSubmit.formData['fm_fp_offence_details_nto_nth'],
    );
    expect(fixedPenaltyDetailsForm.formData['fm_offence_details_date_nto_issued']).toBe(
      formSubmit.formData['fm_fp_offence_details_date_nto_issued'],
    );
    expect(fixedPenaltyDetailsForm.formData['fm_court_details_issuing_authority_id']).toBe(
      formSubmit.formData['fm_fp_court_details_issuing_authority_id'],
    );
  });

  it('should create autocomplete court items', () => {
    const autocompleteItems = component['createAutoCompleteItemsCourts'](OPAL_FINES_COURT_REF_DATA_MOCK);
    expect(autocompleteItems.length).toBe(OPAL_FINES_COURT_REF_DATA_MOCK.refData.length);
  });

  it('should create autocomplete issuina authority items', () => {
    const autocompleteItems = component['createAutoCompleteItemsAuthorities'](
      OPAL_FINES_PROSECUTOR_REF_DATA_MOCK,
      OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK,
    );
    expect(autocompleteItems.length).toBe(
      OPAL_FINES_PROSECUTOR_REF_DATA_MOCK.refData.length + OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK.refData.length,
    );
  });

  it('should set courts and enforcement data onInit', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'createAutoCompleteItemsCourts').and.callThrough();

    component['ngOnInit']();

    expect(component['courts']).toEqual(OPAL_FINES_COURT_REF_DATA_MOCK);
    expect(component['createAutoCompleteItemsCourts']).toHaveBeenCalledWith(OPAL_FINES_COURT_REF_DATA_MOCK);
    expect(component['enforcementCourtData'].length).toEqual(OPAL_FINES_COURT_REF_DATA_MOCK.refData.length);
  });

  it('should set issuing authories data onInit', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'createAutoCompleteItemsAuthorities').and.callThrough();

    component['ngOnInit']();

    expect(component['prosecutors']).toEqual(OPAL_FINES_PROSECUTOR_REF_DATA_MOCK);
    expect(component['localJusticeAreas']).toEqual(OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK);
    expect(component['createAutoCompleteItemsAuthorities']).toHaveBeenCalledWith(
      OPAL_FINES_PROSECUTOR_REF_DATA_MOCK,
      OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK,
    );
    expect(component['issuingAuthoritiesData'].length).toEqual(
      OPAL_FINES_PROSECUTOR_REF_DATA_MOCK.refData.length + OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK.refData.length,
    );
  });
});
