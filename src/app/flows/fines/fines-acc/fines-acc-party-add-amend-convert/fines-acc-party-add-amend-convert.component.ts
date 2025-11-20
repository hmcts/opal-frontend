import { Component, inject, OnDestroy } from '@angular/core';
import { catchError, EMPTY, takeUntil, Subject } from 'rxjs';
import { FinesAccPartyAddAmendConvertFormComponent } from './fines-acc-party-add-amend-convert-form/fines-acc-party-add-amend-convert-form.component';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { IFinesAccPartyAddAmendConvertForm } from './interfaces/fines-acc-party-add-amend-convert-form.interface';
import { IOpalFinesAccountDefendantAccountParty } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-account-party.interface';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { OpalFines } from '../../services/opal-fines-service/opal-fines.service';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
@Component({
  selector: 'app-fines-acc-debtor-add-amend',
  imports: [FinesAccPartyAddAmendConvertFormComponent],
  templateUrl: './fines-acc-party-add-amend-convert.component.html',
})
export class FinesAccPartyAddAmendConvert extends AbstractFormParentBaseComponent implements OnDestroy {
  private readonly ngUnsubscribe = new Subject<void>();
  private readonly payloadService = inject(FinesAccPayloadService);
  private readonly opalFinesService = inject(OpalFines);
  private readonly finesAccStore = inject(FinesAccountStore);
  private readonly utilsService = inject(UtilsService);
  private readonly partyPayload: IOpalFinesAccountDefendantAccountParty =
    this['activatedRoute'].snapshot.data['partyAddAmendConvertData'];

  protected readonly partyType: string = this['activatedRoute'].snapshot.params['partyType'];
  protected readonly prefilledFormData: IFinesAccPartyAddAmendConvertForm = {
    formData: this.payloadService.mapDebtorAccountPartyPayload(
      this.partyPayload,
      this.partyType,
      this.partyPayload.defendant_account_party.is_debtor,
    ),
    nestedFlow: false,
  };
  protected readonly isDebtor: boolean = this.partyPayload.defendant_account_party.is_debtor;

  /**
   * Handles the form submission event from the child form component.
   * @param formData - The form data submitted from the child component
   */
  public handleFormSubmit(formData: IFinesAccPartyAddAmendConvertForm): void {
    // Defensive checks for required store values
    const accountId = this.finesAccStore.account_id();
    const businessUnitId = this.finesAccStore.business_unit_id();
    const partyId =
      this.partyType === 'parentGuardian' ? this.finesAccStore.pg_party_id() : this.finesAccStore.party_id();

    // If any required store values are missing, redirect back to defendant details
    if (!accountId || !businessUnitId || !partyId) {
      this['router'].navigate(['../../details'], {
        relativeTo: this['activatedRoute'],
      });
      return;
    }

    const builtPayload = this.payloadService.buildAccountPartyPayload(
      formData.formData,
      this.partyType,
      this.isDebtor,
      this.partyPayload.defendant_account_party.party_details.party_id,
    );

    this.opalFinesService
      .putDefendantAccountParty(accountId, partyId, builtPayload, this.partyPayload.version!, businessUnitId)
      .pipe(
        catchError(() => {
          this.utilsService.scrollToTop();
          this.stateUnsavedChanges = true;
          return EMPTY;
        }),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe({
        next: () => {
          const fragment = this.partyType === 'parentGuardian' ? 'parent-or-guardian' : 'defendant';
          this['router'].navigate(['../../details'], {
            relativeTo: this['activatedRoute'],
            fragment: fragment,
          });
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

  /**
   * Lifecycle hook that is called just before the component is destroyed.
   *
   * This method ensures that any subscriptions tied to the component lifecycle are properly terminated.
   * It does so by emitting a value on the `ngUnsubscribe` subject, signaling any active subscriptions to complete,
   * and then it completes the subject to free up resources.
   */
  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
