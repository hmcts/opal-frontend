import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { IFinesAccAprErrorContext } from './interfaces/fines-acc-apr-error-context.interface';

@Component({
  selector: 'app-fines-acc-apr-error',
  imports: [RouterLink, GovukHeadingWithCaptionComponent],
  templateUrl: './fines-acc-apr-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccAprErrorComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly accountStore = inject(FinesAccountStore);
  public readonly context = signal<IFinesAccAprErrorContext | null>(null);
  public readonly returnLink = computed(() => ['../', this.context()?.action ?? 'manage']);
  public readonly returnQueryParams = computed(() =>
    this.context()?.action === 'edit' ? { alternatePaymentReferenceId: this.context()?.referenceId } : {},
  );

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const context = this.accountStore.aprErrorContext();
      if (!context || context.accountId !== Number(params.get('accountId'))) {
        this.accountStore.clearAprErrorContext();
        void this.router.navigate(['../manage'], { relativeTo: this.route, replaceUrl: true });
        return;
      }
      this.context.set(context);
    });
  }
}
