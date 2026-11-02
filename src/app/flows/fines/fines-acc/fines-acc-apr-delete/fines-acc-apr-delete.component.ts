import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, finalize, Subject, takeUntil } from 'rxjs';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesAprsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-apr.interface';
import { FinesAccAprTableComponent } from '../fines-acc-apr/fines-acc-apr-table.component';
import { canRemoveApr } from '../fines-acc-apr/fines-acc-apr.utils';
import { FINES_ACC_APR_ROUTING_PATHS } from '../routing/constants/fines-acc-apr-routing-paths.constant';
import { FinesAccountStore } from '../stores/fines-acc.store';

@Component({
  selector: 'app-fines-acc-apr-delete',
  imports: [
    GovukButtonComponent,
    GovukCancelLinkComponent,
    GovukHeadingWithCaptionComponent,
    FinesAccAprTableComponent,
  ],
  templateUrl: './fines-acc-apr-delete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccAprDeleteComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly api = inject(OpalFines);
  private readonly accountStore = inject(FinesAccountStore);
  private readonly contextChanged = new Subject<void>();
  private readonly routeData = toSignal(this.route.data, { initialValue: this.route.snapshot.data });
  private readonly data = computed(() => this.routeData()['aprs'] as IOpalFinesAprsResponse);
  private readonly selectedReference = computed(() => {
    const selectedId = Number(this.route.snapshot.queryParamMap.get('alternatePaymentReferenceId'));
    return this.data().references.find((reference) => reference.alternate_payment_reference_id === selectedId);
  });

  public readonly references = computed(() => {
    const reference = this.selectedReference();
    return reference ? [reference] : [];
  });
  public readonly accountCaption = computed(
    () => `${this.accountStore.getAccountNumber()} - ${this.accountStore.party_name()}`,
  );
  public readonly isRemoving = signal(false);

  constructor() {
    this.route.data.pipe(takeUntilDestroyed()).subscribe(() => {
      this.contextChanged.next();
      this.isRemoving.set(false);
    });
  }

  /** Removes only the selected APR, retaining global HTTP handling for failed requests. */
  public handleRemove(): void {
    const reference = this.selectedReference();
    const version = this.data().version;

    if (this.isRemoving() || !reference || !version?.trim() || !canRemoveApr(reference)) {
      return;
    }

    this.isRemoving.set(true);
    this.api
      .deleteApr(
        Number(this.route.snapshot.paramMap.get('accountId')),
        reference.alternate_payment_reference_id,
        version,
      )
      .pipe(
        catchError(() => EMPTY),
        takeUntil(this.contextChanged),
        finalize(() => this.isRemoving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((response) => {
        this.accountStore.setAccountState({ ...this.accountStore.getAccountState(), base_version: response.version });
        this.api.clearAccountDetailsCache();
        this.accountStore.setSuccessMessage('Alternate payment reference removed');
        this.handleCancel();
      });
  }

  /** Returns to this account's manage page without submitting a removal. */
  public handleCancel(): void {
    void this.router.navigate(['../', FINES_ACC_APR_ROUTING_PATHS.children.list], {
      relativeTo: this.route,
    });
  }
}
