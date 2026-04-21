import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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

@Component({
  selector: 'app-acc-payment-hold-add',
  templateUrl: './fines-acc-payment-hold-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GovukCancelLinkComponent, GovukHeadingWithCaptionComponent],
})
export class FinesAccPaymentHoldAddComponent {
  private readonly ngUnsubscribe = new Subject<void>();
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private finesAccStore = inject(FinesAccountStore);
  private minorCreditorAccountAtAGlance!: IOpalFinesAccountMinorCreditorAtAGlance;
  private finesAccPayloadService = inject(FinesAccPayloadService);
  private opalFinesService = inject(OpalFines);
  public accountNumber = this.finesAccStore.getAccountNumber() ?? '';
  public partyName = this.finesAccStore.party_name() ?? '';

  /**
   * Retrieves the minor creditor account at-a-glance data from the route resolver and assigns it to a local variable for use in the component.
   * This data is necessary for building the payload to add a payment hold on the minor creditor account.
   * If the data is not available, an error will be thrown.
   */
  private getHeaderDataFromRoute(): void {
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
   * Handles the addition of a payment hold.
   */
  public handleAddPaymentHold(): void {
    const payload: IOpalFinesUpdateMinorCreditorAccountPayload =
      this.finesAccPayloadService.buildMinorCreditorAccountUpdatePayload(this.minorCreditorAccountAtAGlance);

    payload.payment.hold_payment = true; // Set hold_payment to true to add the payment hold

    console.log('Base version from store:', this.finesAccStore.base_version());

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
        this.finesAccStore.setSuccessMessage('Payment hold added');
        this.navigateToMinorCreditorDetailsPage();
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public ngOnInit(): void {
    this.getHeaderDataFromRoute();
  }
}
