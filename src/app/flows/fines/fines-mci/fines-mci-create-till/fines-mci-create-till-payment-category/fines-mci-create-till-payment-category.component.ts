import { ChangeDetectionStrategy, Component, DestroyRef, HostListener, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ResolveStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { FinesMciCreateTillPaymentCategoryFormComponent } from './fines-mci-create-till-payment-category-form/fines-mci-create-till-payment-category-form.component';
import { FINES_MCI_ROUTING_PATHS } from '../../routing/constants/fines-mci-routing-paths.constant';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { IFinesMciCreateTillPaymentCategoryFormState } from './interfaces/fines-mci-create-till-payment-category-form-state.interface';

@Component({
  selector: 'app-fines-mci-create-till-payment-category',
  imports: [FinesMciCreateTillPaymentCategoryFormComponent, GovukCancelLinkComponent],
  templateUrl: './fines-mci-create-till-payment-category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateTillPaymentCategoryComponent extends AbstractFormParentBaseComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly navigationRouter = inject(Router);
  private readonly currentRoute = inject(ActivatedRoute);
  private navigationFailed = false;

  protected readonly finesMciStore = inject(FinesMciStore);
  protected readonly isContinuing = signal(false);

  /** Restores leave protection for a category draft restored into the child form. */
  public ngOnInit(): void {
    this.stateUnsavedChanges = this.finesMciStore.draftJourney() !== null;
    this.navigationRouter.events
      .pipe(
        filter((event): event is ResolveStart => event instanceof ResolveStart),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        if (this.isContinuing()) this.stateUnsavedChanges = true;
      });
  }

  /**
   * Saves the selected payment category as a draft and opens its journey without a leave warning.
   * Starting Criminal search clears previous search criteria so a new payment starts with a blank form.
   *
   * @param form The validated payment category form submission.
   */
  public handleSubmit(form: IAbstractFormBaseForm<IFinesMciCreateTillPaymentCategoryFormState>): void {
    if (this.isContinuing()) return;
    const paymentCategory = form.formData.paymentCategory;
    if (!paymentCategory) {
      this.stateUnsavedChanges = true;
      return;
    }

    if (paymentCategory === 'criminal') {
      this.finesMciStore.resetCriminalSearch();
    }
    this.finesMciStore.setDraftJourney(paymentCategory);
    this.stateUnsavedChanges = false;
    this.navigationFailed = false;
    this.isContinuing.set(true);

    const journeyRoute = {
      criminal: [
        FINES_MCI_ROUTING_PATHS.children.payment,
        FINES_MCI_ROUTING_PATHS.children.category,
        FINES_MCI_ROUTING_PATHS.children.criminal,
        FINES_MCI_ROUTING_PATHS.children.search,
      ],
      courtFee: [FINES_MCI_ROUTING_PATHS.children.courtFeeDetails],
      suspense: [FINES_MCI_ROUTING_PATHS.children.suspenseDetails],
    }[paymentCategory];

    void this.navigationRouter
      .navigate(journeyRoute, { relativeTo: this.currentRoute.parent })
      .catch(() => false)
      .then((navigated) => {
        if (!navigated) {
          this.isContinuing.set(false);
          this.navigationFailed = true;
          this.stateUnsavedChanges = true;
        }
      });
  }

  /** Returns to Till Details when the user cancels. */
  public handleCancel(): void {
    void this.navigationRouter
      .navigate([FINES_MCI_ROUTING_PATHS.children.details], { relativeTo: this.currentRoute.parent })
      .then((navigated) => {
        if (navigated) this.finesMciStore.setDraftJourney(null);
      });
  }

  /** Updates the route guard state when the child form changes. */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.stateUnsavedChanges =
      this.navigationFailed || unsavedChanges || (this.isContinuing() && this.stateUnsavedChanges);
  }

  /** Allows the browser to unload only when there are no unsaved changes. */
  @HostListener('window:beforeunload')
  public handleBeforeUnload(): boolean {
    return !this.isContinuing() && !this.stateUnsavedChanges;
  }
}
