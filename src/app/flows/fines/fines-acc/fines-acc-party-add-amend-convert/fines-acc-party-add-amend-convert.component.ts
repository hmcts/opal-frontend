import { Component, inject } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { FinesAccPartyAddAmendConvertFormComponent } from './fines-acc-party-add-amend-convert-form/fines-acc-party-add-amend-convert-form.component';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { IFinesAccPartyAddAmendConvertForm } from './interfaces/fines-acc-party-add-amend-convert-form.interface';
import { IOpalFinesAccountDefendantAccountParty } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-account-party.interface';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { OpalFines } from '../../services/opal-fines-service/opal-fines.service';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_MODES } from './constants/fines-acc-party-add-amend-convert-modes.constant';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES } from './constants/fines-acc-party-add-amend-convert-party-types.constant';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_TEXT } from './constants/fines-acc-party-add-amend-convert-text.constant';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM } from './constants/fines-acc-party-add-amend-convert-form.constant';
@Component({
  selector: 'app-fines-acc-debtor-add-amend',
  imports: [FinesAccPartyAddAmendConvertFormComponent],
  templateUrl: './fines-acc-party-add-amend-convert.component.html',
})
export class FinesAccPartyAddAmendConvert extends AbstractFormParentBaseComponent {
  private readonly payloadService = inject(FinesAccPayloadService);
  private readonly opalFinesService = inject(OpalFines);
  private readonly finesAccStore = inject(FinesAccountStore);
  private readonly utilsService = inject(UtilsService);
  private readonly partyPayload: IOpalFinesAccountDefendantAccountParty | null =
    this['activatedRoute'].snapshot.data['partyAddAmendConvertData'];

  protected readonly finesDefendantRoutingPaths = FINES_ACC_DEFENDANT_ROUTING_PATHS;
  protected readonly partyType: string = this['activatedRoute'].snapshot.params['partyType'];
  protected readonly mode: string =
    this['activatedRoute'].snapshot.params['mode'] ?? FINES_ACC_PARTY_ADD_AMEND_CONVERT_MODES.AMEND;
  protected readonly prefilledFormData: IFinesAccPartyAddAmendConvertForm = {
    formData: this.isAddMode
      ? structuredClone(FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM.formData)
      : this.payloadService.mapDebtorAccountPartyPayload(
          this.partyPayload!,
          this.partyType,
          this.partyPayload!.defendant_account_party.is_debtor,
        ),
    nestedFlow: false,
  };
  protected readonly isDebtor: boolean = this.isAddMode ? false : this.partyPayload!.defendant_account_party.is_debtor;
  protected readonly fragment = this.partyType === 'parentGuardian' ? 'parent-or-guardian' : 'defendant';

  /**
   * Determines whether the shared party details page is running in add mode.
   */
  private get isAddMode(): boolean {
    return this.mode === FINES_ACC_PARTY_ADD_AMEND_CONVERT_MODES.ADD;
  }

  private get successMessage(): string | null {
    if (this.mode !== FINES_ACC_PARTY_ADD_AMEND_CONVERT_MODES.CONVERT) {
      return null;
    }

    if (
      this.partyType === FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.COMPANY ||
      this.partyType === FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.INDIVIDUAL
    ) {
      return FINES_ACC_PARTY_ADD_AMEND_CONVERT_TEXT[this.partyType].successMessage;
    }

    return null;
  }

  /**
   * Handles the form submission event from the child form component.
   * @param formData - The form data submitted from the child component
   */
  public handleFormSubmit(formData: IFinesAccPartyAddAmendConvertForm): void {
    // Defensive checks for required store values
    const accountId = this.finesAccStore.account_id();
    const businessUnitId = this.finesAccStore.business_unit_id();
    const baseVersion = this.finesAccStore.base_version();
    const partyId =
      this.partyType === 'parentGuardian' ? this.finesAccStore.pg_party_id() : this.finesAccStore.party_id();

    // If any required store values are missing, redirect back to defendant details
    if (!accountId || !businessUnitId || (this.isAddMode && !baseVersion) || (!this.isAddMode && !partyId)) {
      this.routerNavigate(this.finesDefendantRoutingPaths.children.details, false, undefined, undefined, this.fragment);
      return;
    }

    const request$ = this.isAddMode
      ? this.opalFinesService.postDefendantAccountParty(
          accountId,
          this.payloadService.buildAddDefendantAccountPayload(formData.formData, this.partyType, this.isDebtor, ''),
          baseVersion!,
          businessUnitId,
        )
      : this.opalFinesService.putDefendantAccountParty(
          accountId,
          partyId!,
          this.payloadService.buildAccountPartyPayload(
            formData.formData,
            this.partyType,
            this.isDebtor,
            this.partyPayload!.defendant_account_party.party_details.party_id,
          ),
          this.partyPayload!.version!,
          businessUnitId,
        );

    request$
      .pipe(
        catchError(() => {
          this.utilsService.scrollToTop();
          this.stateUnsavedChanges = true;
          return EMPTY;
        }),
      )
      .subscribe({
        next: () => {
          const successMessage = this.successMessage;

          this.opalFinesService.clearCache('defendantAccountPartyCache$');
          this.opalFinesService.clearCache('defendantAccountParentOrGuardianAccountPartyCache$');
          if (successMessage) {
            this.finesAccStore.setSuccessMessage(successMessage);
          }
          this.routerNavigate(
            this.finesDefendantRoutingPaths.children.details,
            false,
            undefined,
            undefined,
            this.fragment,
          );
        },
      });
  }

  /**
   * Handles the unsaved changes event from the child form component.
   * @param unsavedChanges - Boolean indicating if there are unsaved changes
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.stateUnsavedChanges = unsavedChanges;
  }
}
