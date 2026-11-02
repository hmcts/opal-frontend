import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { FinesAccAprErrorService, IFinesAccAprErrorContext } from '../fines-acc-apr/fines-acc-apr-error.service';

@Component({
  selector: 'app-fines-acc-apr-error',
  imports: [RouterLink, GovukHeadingWithCaptionComponent],
  templateUrl: './fines-acc-apr-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccAprErrorComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly errorService = inject(FinesAccAprErrorService);
  public readonly context = signal<IFinesAccAprErrorContext | null>(null);
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
