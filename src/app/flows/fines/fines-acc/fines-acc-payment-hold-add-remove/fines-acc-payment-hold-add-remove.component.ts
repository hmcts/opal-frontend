import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, Subject, takeUntil } from 'rxjs';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS } from '../routing/constants/fines-acc-minor-creditor-routing-paths.constant';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { IOpalFinesUpdateMinorCreditorAccountPayload } from '../../services/opal-fines-service/interfaces/opal-fines-update-minor-creditor-account-payload.interface';
import { IOpalFinesAccountMinorCreditorAtAGlance } from '../../services/opal-fines-service/interfaces/opal-fines-account-minor-creditor-at-a-glance.interface';
import { OpalFines } from '../../services/opal-fines-service/opal-fines.service';
import { FINES_ACC_PAYMENT_HOLD_ADD_REMOVE_CONTENT } from './constants/fines-acc-payment-hold-add-remove-content.constant';
import { FinesAccPaymentHoldAddRemoveAction } from './types/fines-acc-payment-hold-add-remove-actions.type';

@Component({
  selector: 'app-acc-payment-hold-add-remove',
  templateUrl: './fines-acc-payment-hold-add-remove.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GovukCancelLinkComponent, GovukHeadingWithCaptionComponent],
})
export class FinesAccPaymentHoldAddRemoveComponent implements OnInit, OnDestroy {
  private readonly ngUnsubscribe = new Subject<void>();
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly finesAccStore = inject(FinesAccountStore);
  private readonly finesAccPayloadService = inject(FinesAccPayloadService);
  private readonly opalFinesService = inject(OpalFines);
  private minorCreditorAccountAtAGlance!: IOpalFinesAccountMinorCreditorAtAGlance;

  public readonly content = FINES_ACC_PAYMENT_HOLD_ADD_REMOVE_CONTENT[this.getPaymentHoldAction()];
  public accountNumber = this.finesAccStore.getAccountNumber() ?? '';
  public partyName = this.finesAccStore.party_name() ?? '';

  /**
   * Gets the payment hold action (add or remove) from the route data and returns it. If the action is not specified or is invalid, it defaults to 'add'.
   * @returns {FinesAccPaymentHoldAddRemoveAction} The payment hold action.
   */
  private getPaymentHoldAction(): FinesAccPaymentHoldAddRemoveAction {
    return this.route.snapshot.data['paymentHoldAction'] === 'remove' ? 'remove' : 'add';
  }

  /**
   * Retrieves the minor creditor account at-a-glance data from the route resolver and assigns it to a local variable for use in the component.
   */
  private getAccountHeaderDataFromRoute(): void {
    this.minorCreditorAccountAtAGlance = this.route.snapshot.data['minorCreditorAccountAtAGlance'];
  }

  /**
   * Navigates to the minor creditor details page with the 'at-a-glance' fragment to display the overview tab.
   */
  public navigateToMinorCreditorDetailsPage(): void {
    this.router.navigate([`../../${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children.details}`], {
      relativeTo: this.route,
      fragment: 'at-a-glance',
    });
  }

  /**
   * Handles the addition or removal of a payment hold based on the current action.
   * It builds the appropriate payload using the minor creditor account data and calls the service to update the account.
   * After a successful update, it sets a success message if applicable and navigates back to the minor creditor details page.
   * If an error occurs during the update, it catches the error and prevents further actions.
   */
  public handlePaymentHold(): void {
    const payload: IOpalFinesUpdateMinorCreditorAccountPayload =
      this.finesAccPayloadService.buildMinorCreditorAccountUpdatePayload(this.minorCreditorAccountAtAGlance);

    payload.payment.hold_payment = this.content.holdPayment;

    this.opalFinesService
      .updateMinorCreditorAccount(
        this.finesAccStore.account_id()!,
        payload,
        this.finesAccStore.base_version()!,
        this.finesAccStore.business_unit_id()!,
      )
      .pipe(
        catchError(() => {
          return EMPTY;
        }),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe(() => {
        if (this.content.successMessage) {
          this.finesAccStore.setSuccessMessage(this.content.successMessage);
        }

        this.navigateToMinorCreditorDetailsPage();
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public ngOnInit(): void {
    this.getAccountHeaderDataFromRoute();
  }
}
