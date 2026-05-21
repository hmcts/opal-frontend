import { Component, inject } from '@angular/core';
import { catchError, EMPTY, Observable } from 'rxjs';
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
import { FINES_ACC_DEFENDANT_DETAILS_TABS_KEYS } from '../fines-acc-defendant-details/constants/fines-acc-defendant-details-tabs-keys.constant';
import { type TFinesAccDefendantDetailsTabKey } from '../fines-acc-defendant-details/types/fines-acc-defendant-details-tab-key.type';
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
  protected readonly prefilledFormData: IFinesAccPartyAddAmendConvertForm = this.getPrefilledFormData();
  protected readonly isDebtor: boolean = this.getIsDebtor();
  protected readonly fragment = this.getFragment();

  /**
   * Gets the initial form data for add flows or maps the resolved party payload for amend and convert flows.
   * @returns The form data used to initialise the child form
   */
  private getPrefilledFormData(): IFinesAccPartyAddAmendConvertForm {
    if (this.isAddMode) {
      return {
        formData: structuredClone(FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM.formData),
        nestedFlow: false,
      };
    }

    return {
      formData: this.payloadService.mapDebtorAccountPartyPayload(
        this.partyPayload!,
        this.partyType,
        this.partyPayload!.defendant_account_party.is_debtor,
      ),
      nestedFlow: false,
    };
  }

  /**
   * Determines whether the current party submission should be sent as a debtor.
   * @returns False for add mode, otherwise the debtor flag from the resolved party payload
   */
  private getIsDebtor(): boolean {
    if (this.isAddMode) {
      return false;
    }

    return this.partyPayload!.defendant_account_party.is_debtor;
  }

  /**
   * Gets the details page fragment to return to after submit or redirect.
   * @returns The parent or guardian fragment for parent guardian routes, otherwise the defendant fragment
   */
  private getFragment(): TFinesAccDefendantDetailsTabKey {
    if (this.partyType === FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.PARENT_GUARDIAN) {
      return FINES_ACC_DEFENDANT_DETAILS_TABS_KEYS['parent-or-guardian'];
    }

    return FINES_ACC_DEFENDANT_DETAILS_TABS_KEYS.defendant;
  }

  /**
   * Determines whether the shared party details page is running in add mode.
   */
  private get isAddMode(): boolean {
    return this.mode === FINES_ACC_PARTY_ADD_AMEND_CONVERT_MODES.ADD;
  }

  /**
   * Returns the post-submit success message for convert flows that display one.
   */
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
   * Gets the party identifier required for amend and convert submissions.
   */
  private get partyId(): string | null {
    if (this.partyType === FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.PARENT_GUARDIAN) {
      return this.finesAccStore.pg_party_id();
    }

    return this.finesAccStore.party_id();
  }

  /**
   * Gets the account base version required when adding a parent or guardian party.
   */
  private get baseVersion(): string | null {
    return this.finesAccStore.base_version();
  }

  /**
   * Builds and sends the request for adding a parent or guardian party.
   * @param formData - The form data submitted from the child component
   * @returns An observable containing the added defendant account party response
   */
  private addDefendantAccountParty(
    formData: IFinesAccPartyAddAmendConvertForm,
  ): Observable<IOpalFinesAccountDefendantAccountParty> {
    return this.opalFinesService.postDefendantAccountParty(
      this.finesAccStore.account_id()!,
      this.payloadService.buildAddDefendantAccountPayload(formData.formData, this.partyType, this.isDebtor, ''),
      this.baseVersion!,
      this.finesAccStore.business_unit_id()!,
    );
  }

  /**
   * Builds and sends the request for amending or converting an existing party.
   * @param formData - The form data submitted from the child component
   * @returns An observable containing the updated defendant account party response
   */
  private updateDefendantAccountParty(
    formData: IFinesAccPartyAddAmendConvertForm,
  ): Observable<IOpalFinesAccountDefendantAccountParty> {
    return this.opalFinesService.putDefendantAccountParty(
      this.finesAccStore.account_id()!,
      this.partyId!,
      this.payloadService.buildAccountPartyPayload(
        formData.formData,
        this.partyType,
        this.isDebtor,
        this.partyPayload!.defendant_account_party.party_details.party_id,
      ),
      this.partyPayload!.version!,
      this.finesAccStore.business_unit_id()!,
    );
  }

  /**
   * Handles the form submission event from the child form component.
   * @param formData - The form data submitted from the child component
   */
  public handleFormSubmit(formData: IFinesAccPartyAddAmendConvertForm): void {
    let request$: Observable<IOpalFinesAccountDefendantAccountParty>;
    if (this.isAddMode) {
      request$ = this.addDefendantAccountParty(formData);
    } else {
      request$ = this.updateDefendantAccountParty(formData);
    }

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
