import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { IOpalFinesCourtFee } from '@services/fines/opal-fines-service/interfaces/opal-fines-court-fees.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FINES_MCI_ROUTING_PATHS } from '../../routing/constants/fines-mci-routing-paths.constant';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { IFinesMciCourtFeeDraft } from '../../stores/interfaces/fines-mci.interface';
import { FinesMciCreateTillCourtFeeDetailsFormComponent } from './fines-mci-create-till-court-fee-details-form/fines-mci-create-till-court-fee-details-form.component';
import { compareCourtFeeAmounts } from '../utils/fines-mci-court-fee-payment.utils';

@Component({
  selector: 'app-fines-mci-create-till-court-fee-details',
  imports: [FinesMciCreateTillCourtFeeDetailsFormComponent, GovukCancelLinkComponent],
  templateUrl: './fines-mci-create-till-court-fee-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateTillCourtFeeDetailsComponent
  extends AbstractFormParentBaseComponent
  implements OnInit, OnDestroy
{
  private readonly opalFines = inject(OpalFines);
  private readonly navigationRouter = inject(Router);
  private readonly currentRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly courtFees = signal<IOpalFinesCourtFee[]>([]);
  private isContinuing = false;
  private navigationFailed = false;

  protected readonly finesMciStore = inject(FinesMciStore);
  protected readonly courtFeeItems = signal<IAlphagovAccessibleAutocompleteItem[]>([]);
  protected readonly feeLoadFailed = signal(false);
  protected readonly feesLoaded = signal(false);

  public ngOnInit(): void {
    this.stateUnsavedChanges = this.finesMciStore.courtFeeDraft() !== null;
    const businessUnitId = this.finesMciStore.businessUnit()?.business_unit_id;
    if (businessUnitId == null) {
      this.feeLoadFailed.set(true);
      return;
    }

    this.opalFines
      .getCourtFees(businessUnitId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ court_fees }) => {
          this.courtFees.set(court_fees);
          this.courtFeeItems.set(
            court_fees.map(({ court_fee_id, court_fee_code, description, amount }) => ({
              value: court_fee_id,
              name: `${court_fee_code} - ${description} (£${amount.toFixed(2)})`,
            })),
          );
          this.feesLoaded.set(true);
        },
        error: () => this.feeLoadFailed.set(true),
      });
  }

  /** Saves a valid payment draft and opens the appropriate next screen. */
  public handleSubmit(form: IAbstractFormBaseForm<IFinesMciCourtFeeDraft>): void {
    const { courtFeeId, amountPaid, numberOfItems } = form.formData;
    const selectedFee = this.courtFees().find(({ court_fee_id }) => court_fee_id === courtFeeId);
    if (!selectedFee || !amountPaid || !numberOfItems) return;
    const comparison = compareCourtFeeAmounts(amountPaid, selectedFee.amount, numberOfItems);
    if (!comparison) return;

    this.finesMciStore.setCourtFeeDraft(form.formData);
    let destination = FINES_MCI_ROUTING_PATHS.children.overUnderpaymentConfirmation;
    if (comparison.difference === 0n) {
      destination = FINES_MCI_ROUTING_PATHS.children.courtFeePaymentDetails;
    }

    this.navigationFailed = false;
    this.stateUnsavedChanges = false;
    this.isContinuing = true;
    void this.navigationRouter
      .navigate([`../${destination}`], { relativeTo: this.currentRoute })
      .catch(() => false)
      .then((navigated) => {
        if (!navigated) {
          this.isContinuing = false;
          this.navigationFailed = true;
          this.stateUnsavedChanges = true;
        }
      });
  }

  public handleCancel(): void {
    void this.navigationRouter
      .navigate([`../${FINES_MCI_ROUTING_PATHS.children.details}`], { relativeTo: this.currentRoute })
      .then((navigated) => {
        if (navigated) {
          this.finesMciStore.setCourtFeeDraft(null);
          this.finesMciStore.setDraftJourney(null);
        }
      });
  }

  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.stateUnsavedChanges = this.navigationFailed || unsavedChanges;
  }

  @HostListener('window:beforeunload')
  public handleBeforeUnload(): boolean {
    return this.canDeactivate() === true;
  }

  public ngOnDestroy(): void {
    if (!this.isContinuing) {
      this.finesMciStore.setCourtFeeDraft(null);
      this.finesMciStore.setDraftJourney(null);
    }
  }
}
