import { ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { catchError, EMPTY, Subject, takeUntil } from 'rxjs';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { OpalFines } from '../../services/opal-fines-service/opal-fines.service';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { IFinesAccEnfColloChangeFormState } from './interfaces/fines-acc-enf-collo-change-form-state.interface';
import { FinesAccEnfColloChangeFormComponent } from './fines-acc-enf-collo-change-form/fines-acc-enf-collo-change-form.component';

@Component({
  selector: 'app-fines-acc-enf-collo-change',
  templateUrl: './fines-acc-enf-collo-change.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FinesAccEnfColloChangeFormComponent],
})
export class FinesAccEnfColloChangeComponent extends AbstractFormParentBaseComponent implements OnDestroy {
  private readonly ngUnsubscribe = new Subject<void>();
  private readonly finesAccStore = inject(FinesAccountStore);
  private readonly finesAccPayloadService = inject(FinesAccPayloadService);
  private readonly opalFinesService = inject(OpalFines);
  private readonly utilsService = inject(UtilsService);
  private readonly finesDefendantRoutingPaths = FINES_ACC_DEFENDANT_ROUTING_PATHS;

  public readonly accountNumber = this.finesAccStore.getAccountNumber() ?? '';
  public readonly partyName = this.finesAccStore.party_name() ?? '';

  /**
   * Navigates back to the enforcement tab and optionally sets a success message.
   *
   * @param setSuccessMessage Whether to set the success banner before navigation.
   */
  private navigateToEnforcementTab(setSuccessMessage = false): void {
    this.stateUnsavedChanges = false;

    if (setSuccessMessage) {
      this.finesAccStore.setSuccessMessage('Collection Order status changed');
    }

    this.routerNavigate(this.finesDefendantRoutingPaths.children.details, false, undefined, null, 'enforcement');
  }

  /**
   * Submits the selected Collection Order status for the current account.
   *
   * @param form The form payload emitted by the child form component.
   */
  public handleSubmit(form: IAbstractFormBaseForm<IFinesAccEnfColloChangeFormState>): void {
    const payload = this.finesAccPayloadService.buildCollectionOrderPayload(form);

    this.opalFinesService
      .patchDefendantAccount(
        this.finesAccStore.account_id()!,
        payload,
        this.finesAccStore.base_version()!,
        this.finesAccStore.business_unit_id()!,
      )
      .pipe(
        catchError(() => {
          this.utilsService.scrollToTop();
          return EMPTY;
        }),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe(() => {
        this.opalFinesService.clearCache('defendantAccountEnforcementCache$');
        this.navigateToEnforcementTab(true);
      });
  }

  /**
   * Updates the page-level unsaved changes state from the child form.
   *
   * @param unsavedChanges Whether the form currently has unsaved changes.
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.stateUnsavedChanges = unsavedChanges;
  }

  /**
   * Completes the teardown notifier used by active subscriptions.
   */
  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
