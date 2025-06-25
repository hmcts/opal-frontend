import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { IFinesMacFixedPenaltyDetailsForm } from './interfaces/fines-mac-fixed-penalty-details-form.interface';
import { FinesMacFixedPenaltyDetailsFormComponent } from './fines-mac-fixed-penalty-details-form/fines-mac-fixed-penalty-details-form.component';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths.constant';
import { FinesMacStore } from '../stores/fines-mac.store';
import { IFinesMacPersonalDetailsForm } from '../fines-mac-personal-details/interfaces/fines-mac-personal-details-form.interface';
import { FINES_MAC_PERSONAL_DETAILS_FORM } from '../fines-mac-personal-details/constants/fines-mac-personal-details-form';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesCourtRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-court-ref-data.interface';
import { IFinesMacCourtDetailsForm } from '../fines-mac-court-details/interfaces/fines-mac-court-details-form.interface';
import { FINES_MAC_COURT_DETAILS_FORM } from '../fines-mac-court-details/constants/fines-mac-court-details-form';
import { IFinesMacAccountCommentsNotesForm } from '../fines-mac-account-comments-notes/interfaces/fines-mac-account-comments-notes-form.interface';
import { FINES_MAC_ACCOUNT_COMMENTS_NOTES_FORM } from '../fines-mac-account-comments-notes/constants/fines-mac-account-comments-notes-form';
import { IFinesMacLanguagePreferencesForm } from '../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-form.interface';
import { FINES_MAC_LANGUAGE_PREFERENCES_FORM } from '../fines-mac-language-preferences/constants/fines-mac-language-preferences-form';
import { IFinesMacFixedPenaltyDetailsStoreForm } from './interfaces/fines-mac-fixed-penalty-details-store-form.interface';
import { FINES_MAC_FIXED_PENALTY_DETAILS_STORE_FORM } from './constants/fines-mac-fixed-penalty-details-store-form';
import { IOpalFinesIssuingAuthorityRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-issuing-authority-ref-data.interface';

@Component({
  selector: 'app-fines-mac-fixed-penalty-details',
  imports: [FinesMacFixedPenaltyDetailsFormComponent],
  templateUrl: './fines-mac-fixed-penalty-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacFixedPenaltyDetailsComponent extends AbstractFormParentBaseComponent implements OnInit {
  private readonly opalFinesService = inject(OpalFines);
  private readonly finesMacStore = inject(FinesMacStore);
  public defendantType = this.finesMacStore.getDefendantType();
  public enforcementCourtData: IAlphagovAccessibleAutocompleteItem[] = [];
  public issuingAuthoritiesData: IAlphagovAccessibleAutocompleteItem[] = [];
  private courts!: IOpalFinesCourtRefData;
  private issuingAuthorities!: IOpalFinesIssuingAuthorityRefData;

  /**
   * Handles the submission of personal details form.
   *
   * @param form - The personal details form data.
   * @returns void
   */
  public handleFixedPenaltyDetailsSubmit(form: IFinesMacFixedPenaltyDetailsForm): void {
    this.finesMacStore.setPersonalDetails(this.createPersonalDetailsFormForStore(form));
    this.finesMacStore.setCourtDetails(this.createCourtDetailsFormForStore(form));
    this.finesMacStore.setAccountCommentsNotes(this.createCommentsAndNotesFormForStore(form));
    this.finesMacStore.setLanguagePreferences(this.createLanguagePreferencesFormForStore(form));
    this.finesMacStore.setFixedPenaltyDetails(this.createFixedPenaltyDetailsFormForStore(form));
    this.routerNavigate(FINES_MAC_ROUTING_PATHS.children.reviewAccount);
  }

  /**
   * Handles unsaved changes coming from the child component
   *
   * @param unsavedChanges boolean value from child component
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.finesMacStore.setUnsavedChanges(unsavedChanges);
    this.stateUnsavedChanges = unsavedChanges;
  }

  private createPersonalDetailsFormForStore(form: IFinesMacFixedPenaltyDetailsForm): IFinesMacPersonalDetailsForm {
    const _form: IFinesMacPersonalDetailsForm = FINES_MAC_PERSONAL_DETAILS_FORM;

    _form.formData['fm_personal_details_title'] = form.formData['fm_fp_personal_details_title'];
    _form.formData['fm_personal_details_forenames'] = form.formData['fm_fp_personal_details_forenames'];
    _form.formData['fm_personal_details_surname'] = form.formData['fm_fp_personal_details_surname'];
    _form.formData['fm_personal_details_dob'] = form.formData['fm_fp_personal_details_dob'];
    _form.formData['fm_personal_details_address_line_1'] = form.formData['fm_fp_personal_details_address_line_1'];
    _form.formData['fm_personal_details_address_line_2'] = form.formData['fm_fp_personal_details_address_line_2'];
    _form.formData['fm_personal_details_address_line_3'] = form.formData['fm_fp_personal_details_address_line_3'];
    _form.formData['fm_personal_details_post_code'] = form.formData['fm_fp_personal_details_post_code'];

    return _form;
  }

  private createCourtDetailsFormForStore(form: IFinesMacFixedPenaltyDetailsForm): IFinesMacCourtDetailsForm {
    const _form: IFinesMacCourtDetailsForm = FINES_MAC_COURT_DETAILS_FORM;

    _form.formData['fm_court_details_imposing_court_id'] = form.formData['fm_fp_court_details_imposing_court_id'];

    return _form;
  }

  private createCommentsAndNotesFormForStore(
    form: IFinesMacFixedPenaltyDetailsForm,
  ): IFinesMacAccountCommentsNotesForm {
    const _form: IFinesMacAccountCommentsNotesForm = FINES_MAC_ACCOUNT_COMMENTS_NOTES_FORM;

    _form.formData['fm_account_comments_notes_comments'] = form.formData['fm_fp_account_comments_notes_comments'];
    _form.formData['fm_account_comments_notes_notes'] = form.formData['fm_fp_account_comments_notes_notes'];
    _form.formData['fm_account_comments_notes_system_notes'] =
      form.formData['fm_fp_account_comments_notes_system_notes'];

    return _form;
  }

  private createLanguagePreferencesFormForStore(
    form: IFinesMacFixedPenaltyDetailsForm,
  ): IFinesMacLanguagePreferencesForm {
    const _form: IFinesMacLanguagePreferencesForm = FINES_MAC_LANGUAGE_PREFERENCES_FORM;

    _form.formData['fm_language_preferences_document_language'] =
      form.formData['fm_fp_language_preferences_document_language'];
    _form.formData['fm_language_preferences_hearing_language'] =
      form.formData['fm_fp_language_preferences_hearing_language'];

    return _form;
  }

  private createFixedPenaltyDetailsFormForStore(
    form: IFinesMacFixedPenaltyDetailsForm,
  ): IFinesMacFixedPenaltyDetailsStoreForm {
    const _form: IFinesMacFixedPenaltyDetailsStoreForm = FINES_MAC_FIXED_PENALTY_DETAILS_STORE_FORM;

    _form.formData['fm_offence_details_notice_number'] = form.formData['fm_fp_offence_details_notice_number'];
    _form.formData['fm_offence_details_offence_type'] = form.formData['fm_fp_offence_details_offence_type'];
    _form.formData['fm_offence_details_date_of_offence'] = form.formData['fm_fp_offence_details_date_of_offence'];
    _form.formData['fm_offence_details_offence_id'] = form.formData['fm_fp_offence_details_offence_id'];
    _form.formData['fm_offence_details_offence_cjs_code'] = form.formData['fm_fp_offence_details_offence_cjs_code'];
    _form.formData['fm_offence_details_time_of_offence'] = form.formData['fm_fp_offence_details_time_of_offence'];
    _form.formData['fm_offence_details_place_of_offence'] = form.formData['fm_fp_offence_details_place_of_offence'];
    _form.formData['fm_offence_details_amount_imposed'] = form.formData['fm_fp_offence_details_amount_imposed'];
    _form.formData['fm_offence_details_vehicle_registration_number'] =
      form.formData['fm_fp_offence_details_vehicle_registration_number'];
    _form.formData['fm_offence_details_driving_licence_number'] =
      form.formData['fm_fp_offence_details_driving_licence_number'];
    _form.formData['fm_offence_details_nto_nth'] = form.formData['fm_fp_offence_details_nto_nth'];
    _form.formData['fm_offence_details_date_nto_issued'] = form.formData['fm_fp_offence_details_date_nto_issued'];
    _form.formData['fm_court_details_issuing_authority_id'] = form.formData['fm_fp_court_details_issuing_authority_id'];

    return _form;
  }

  /**
   * Creates an array of autocomplete items based on the response from the server.
   * @param response - The response object containing the local justice area reference data.
   * @returns An array of autocomplete items.
   */
  private createAutoCompleteItemsCourts(response: IOpalFinesCourtRefData): IAlphagovAccessibleAutocompleteItem[] {
    const courts = response.refData;

    return courts.map((item) => {
      return {
        value: item.court_id,
        name: this.opalFinesService.getCourtPrettyName(item),
      };
    });
  }

  /**
   * Creates an array of autocomplete items based on the response from the server.
   * @param response - The response object containing the local justice area reference data.
   * @returns An array of autocomplete items.
   */
  private createAutoCompleteItemsAuthorities(
    response: IOpalFinesIssuingAuthorityRefData,
  ): IAlphagovAccessibleAutocompleteItem[] {
    const issuingAuthorities = response.refData;

    return issuingAuthorities.map((item) => {
      return {
        value: item.authority_id,
        name: this.opalFinesService.getIssuingAuthorityPrettyName(item),
      };
    });
  }

  public ngOnInit(): void {
    this.courts = this['activatedRoute'].snapshot.data['courts'];
    this.enforcementCourtData = this.createAutoCompleteItemsCourts(this.courts);
    this.issuingAuthorities = this['activatedRoute'].snapshot.data['issuingAuthorities'];
    this.issuingAuthoritiesData = this.createAutoCompleteItemsAuthorities(this.issuingAuthorities);
  }
}
