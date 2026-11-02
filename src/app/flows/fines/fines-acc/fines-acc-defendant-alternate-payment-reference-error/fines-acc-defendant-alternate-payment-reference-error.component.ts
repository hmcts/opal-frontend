import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import {
  FinesAccAlternatePaymentReferenceErrorService,
  IFinesAccAlternatePaymentReferenceErrorContext,
} from '../fines-acc-defendant-alternate-payment-reference/fines-acc-alternate-payment-reference-error.service';

@Component({
  selector: 'app-fines-acc-defendant-alternate-payment-reference-error',
  imports: [RouterLink, GovukHeadingWithCaptionComponent],
  templateUrl: './fines-acc-defendant-alternate-payment-reference-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantAlternatePaymentReferenceErrorComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly errorService = inject(FinesAccAlternatePaymentReferenceErrorService);
  public readonly context = signal<IFinesAccAlternatePaymentReferenceErrorContext | null>(null);
  public readonly returnLink = computed(() => ['../', this.context()?.action ?? 'list']);
  public readonly returnQueryParams = computed(() =>
    this.context()?.action === 'edit' ? { alternatePaymentReferenceId: this.context()?.referenceId } : {},
  );

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const context = this.errorService.context();
      if (!context || context.accountId !== Number(params.get('accountId'))) {
        this.errorService.clear();
        void this.router.navigate(['../list'], { relativeTo: this.route, replaceUrl: true });
        return;
      }
      this.context.set(context);
    });
  }
}
