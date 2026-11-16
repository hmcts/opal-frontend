import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { finalize } from 'rxjs';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { IFinesMciPaymentMappings } from '../../routing/interfaces/fines-mci-payment-mappings.interface';
import { FINES_MCI_ROUTING_PATHS } from '../../routing/constants/fines-mci-routing-paths.constant';
import { FinesMciCreateTillCourtFeePaymentDetailsFormComponent } from './fines-mci-create-till-court-fee-payment-details-form/fines-mci-create-till-court-fee-payment-details-form.component';
import { IFinesMciCourtFeePaymentDetails } from '../../stores/interfaces/fines-mci-court-fee-payment-details.interface';
import { FinesMciPaymentMappingsService } from '../../services/fines-mci-payment-mappings.service';

@Component({
  selector: 'app-fines-mci-create-till-court-fee-payment-details',
  imports: [
    FinesMciCreateTillCourtFeePaymentDetailsFormComponent,
    GovukBackLinkComponent,
    GovukCancelLinkComponent,
    GovukButtonComponent,
  ],
  templateUrl: './fines-mci-create-till-court-fee-payment-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateTillCourtFeePaymentDetailsComponent
  extends AbstractFormParentBaseComponent
  implements OnInit
{
  private readonly navigationRouter = inject(Router);
  private readonly currentRoute = inject(ActivatedRoute);
  private readonly paymentMappingsService = inject(FinesMciPaymentMappingsService);
  private readonly destroyRef = inject(DestroyRef);
  @ViewChild('paymentHeading', { read: ElementRef }) private readonly paymentHeading?: ElementRef<HTMLElement>;
  private isContinuing = false;
  private readonly previousUrlPath = this.navigationRouter
    .currentNavigation()
    ?.previousNavigation?.finalUrl?.toString()
    .split(/[?#]/)[0];

  protected readonly finesMciStore = inject(FinesMciStore);
  protected readonly isNavigating = signal(false);
  protected readonly isRetrying = signal(false);
  protected readonly paymentMappings = signal(
    (this.currentRoute.snapshot.data['paymentMappings'] as IFinesMciPaymentMappings | null | undefined) ?? null,
  );

  /**
   * Opens a sibling screen while preventing edits during navigation.
   *
   * @param destination The sibling route to open.
   * @returns Whether the navigation succeeded.
   */
  private async navigateTo(destination: string): Promise<boolean> {
    if (this.isNavigating()) return false;
    this.isNavigating.set(true);
    try {
      return await this.navigationRouter.navigate([`../${destination}`], { relativeTo: this.currentRoute });
    } catch {
      return false;
    } finally {
      this.isNavigating.set(false);
    }
  }

  /** Allows the validated Continue transition while protecting the draft from other route changes. */
  protected override canDeactivate(): boolean {
    const target = this.navigationRouter.currentNavigation()?.finalUrl?.toString().split(/[?#]/)[0];
    if (this.isContinuing && target?.endsWith(`/${FINES_MCI_ROUTING_PATHS.children.checkCourtFee}`)) return true;
    return super.canDeactivate() === true;
  }

  /** Restores draft protection and records the entry screen for Back navigation. */
  public ngOnInit(): void {
    const confirmation = FINES_MCI_ROUTING_PATHS.children.overUnderpaymentConfirmation;
    const details = FINES_MCI_ROUTING_PATHS.children.courtFeeDetails;
    if (this.previousUrlPath?.endsWith(`/${confirmation}`))
      this.finesMciStore.setCourtFeePaymentOrigin('over-underpayment-confirmation');
    else if (this.previousUrlPath?.endsWith(`/${details}`) || !this.finesMciStore.courtFeePaymentOrigin()) {
      this.finesMciStore.setCourtFeePaymentOrigin('court-fee-details');
    }
    this.stateUnsavedChanges = this.finesMciStore.courtFeePaymentDetails() !== null;
  }

  /** Returns to the screen that led to payment details, keeping the court fee draft. */
  public handleBack(): void {
    const destination = this.finesMciStore.courtFeePaymentOrigin() ?? FINES_MCI_ROUTING_PATHS.children.courtFeeDetails;
    void this.navigateTo(destination).then((navigated) => {
      if (navigated) this.finesMciStore.setCourtFeePaymentDetails(null);
    });
  }

  /** Returns to the till and discards the court fee draft only after navigation succeeds. */
  public handleCancel(): void {
    void this.navigateTo(FINES_MCI_ROUTING_PATHS.children.details).then((navigated) => {
      if (navigated) this.finesMciStore.setDraftJourney(null);
    });
  }

  /** Reloads payment options without leaving the screen or discarding the saved draft. */
  public handleRetry(): void {
    if (this.isRetrying() || this.isNavigating()) return;
    this.isRetrying.set(true);
    this.paymentMappingsService
      .load(true)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isRetrying.set(false)),
      )
      .subscribe((mappings) => {
        this.paymentMappings.set(mappings);
        if (mappings) this.paymentHeading?.nativeElement.focus();
      });
  }

  /** Saves validated payment details and opens the temporary check screen. */
  public handleSubmit(form: IAbstractFormBaseForm<IFinesMciCourtFeePaymentDetails>): void {
    if (this.isNavigating()) return;
    this.finesMciStore.setCourtFeePaymentDetails(form.formData);
    this.isContinuing = true;
    this.stateUnsavedChanges = true;
    void this.navigateTo(FINES_MCI_ROUTING_PATHS.children.checkCourtFee).then((navigated) => {
      this.isContinuing = false;
      if (!navigated) this.stateUnsavedChanges = true;
    });
  }

  /** Tracks entered payment details for the route leave warning. */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.stateUnsavedChanges = unsavedChanges || this.finesMciStore.courtFeePaymentDetails() !== null;
  }

  /** Requests a warning before refreshing or closing the tab containing the in-memory till. */
  @HostListener('window:beforeunload')
  public handleBeforeUnload(): boolean {
    return false;
  }
}
