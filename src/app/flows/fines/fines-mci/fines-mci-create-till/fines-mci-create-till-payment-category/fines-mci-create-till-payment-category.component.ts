import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { CanDeactivateTypes } from '@hmcts/opal-frontend-common/guards/can-deactivate/types';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import {
  GovukRadioComponent,
  GovukRadiosItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { IAbstractFormBaseFormErrorSummaryMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { FINES_MCI_ROUTING_PATHS } from '../../routing/constants/fines-mci-routing-paths.constant';
import { FinesMciJourney, FinesMciStore } from '../../stores/fines-mci.store';

const SELECT_PAYMENT_CATEGORY_ERROR = 'Select payment category';

@Component({
  selector: 'app-fines-mci-create-till-payment-category',
  imports: [
    GovukCancelLinkComponent,
    GovukErrorSummaryComponent,
    GovukRadioComponent,
    GovukRadiosItemComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './fines-mci-create-till-payment-category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateTillPaymentCategoryComponent {
  private allowIntendedNavigation = false;
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly changeDetector = inject(ChangeDetectorRef);
  @ViewChild('errorSummary', { read: ElementRef }) private readonly errorSummary?: ElementRef<HTMLElement>;
  protected readonly finesMciStore = inject(FinesMciStore);
  protected readonly form = new FormGroup({
    paymentCategory: new FormControl<FinesMciJourney | null>(null, Validators.required),
  });
  protected formErrorSummaryMessage: IAbstractFormBaseFormErrorSummaryMessage[] = [];
  protected paymentCategoryError: string | null = null;

  public constructor() {
    this.form.controls.paymentCategory.valueChanges.pipe(takeUntilDestroyed()).subscribe((category) => {
      if (category) {
        this.formErrorSummaryMessage = [];
        this.paymentCategoryError = null;
        this.changeDetector.markForCheck();
      }
    });
  }

  private tillDetailsRoute(): string[] {
    return [
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_MCI_ROUTING_PATHS.root,
      FINES_MCI_ROUTING_PATHS.children.create,
      FINES_MCI_ROUTING_PATHS.children.till,
      FINES_MCI_ROUTING_PATHS.children.details,
    ];
  }

  private showValidationError(): void {
    this.formErrorSummaryMessage = [
      {
        fieldId: 'paymentCategory-fines-mci-payment-category-criminal',
        message: SELECT_PAYMENT_CATEGORY_ERROR,
      },
    ];
    this.paymentCategoryError = SELECT_PAYMENT_CATEGORY_ERROR;
    this.changeDetector.detectChanges();
    this.errorSummary?.nativeElement.querySelector<HTMLElement>('.govuk-error-summary')?.focus({ preventScroll: true });
  }

  protected scrollTo(fieldId: string): void {
    this.document.getElementById(fieldId)?.focus();
  }

  public handleSubmit(): void {
    const category = this.form.controls.paymentCategory.value;
    if (!category) {
      this.showValidationError();
      return;
    }

    this.formErrorSummaryMessage = [];
    this.paymentCategoryError = null;
    if (category === 'criminal') {
      this.allowIntendedNavigation = true;
      void this.router.navigate([
        '/',
        FINES_ROUTING_PATHS.root,
        FINES_MCI_ROUTING_PATHS.root,
        FINES_MCI_ROUTING_PATHS.children.create,
        FINES_MCI_ROUTING_PATHS.children.till,
        FINES_MCI_ROUTING_PATHS.children.searchAccount,
      ]);
    }
  }

  public handleCancel(): void {
    void this.router.navigate(this.tillDetailsRoute());
  }

  public canDeactivate(): CanDeactivateTypes {
    return this.allowIntendedNavigation || !this.form.controls.paymentCategory.value;
  }

  @HostListener('window:beforeunload')
  public handleBeforeUnload(): boolean {
    return this.allowIntendedNavigation || !this.form.controls.paymentCategory.value;
  }
}
