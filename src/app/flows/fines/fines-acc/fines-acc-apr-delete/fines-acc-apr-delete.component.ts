import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { catchError, EMPTY, filter, finalize, Subject, takeUntil } from 'rxjs';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesAprsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-apr.interface';
import { FinesAccAprManageTableComponent } from '../fines-acc-apr-manage/fines-acc-apr-manage-table/fines-acc-apr-manage-table.component';
import { IFinesAccAprManageRow } from '../fines-acc-apr-manage/interfaces/fines-acc-apr-manage-row.interface';
import { FINES_ACC_APR_ROUTING_PATHS } from '../fines-acc-apr-manage/constants/fines-acc-apr-routing-paths.constant';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FINES_ACC_APR_DELETE_SUCCESS_MESSAGE } from './constants/fines-acc-apr-delete-success-message.constant';

@Component({
  selector: 'app-fines-acc-apr-delete',
  imports: [GovukCancelLinkComponent, FinesAccAprManageTableComponent],
  templateUrl: './fines-acc-apr-delete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccAprDeleteComponent implements OnInit, OnDestroy {
  private readonly ngUnsubscribe = new Subject<void>();
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(OpalFines);
  private readonly payloadService = inject(FinesAccPayloadService);
  private readonly accountStore = inject(FinesAccountStore);
  private readonly contextChanged = new Subject<void>();
  private readonly selectedReference = signal<IFinesAccAprManageRow | null>(null);
  private currentContext: {
    accountId: number;
    referenceId: number;
    aprs: IOpalFinesAprsResponse;
    version: string | null;
  } | null = null;

  public readonly references = computed(() => {
    const reference = this.selectedReference();
    return reference ? [reference] : [];
  });
  public readonly isRemoving = signal(false);

  private resetReferenceContext(): void {
    const snapshot = this.route.snapshot;
    const accountId = Number(snapshot.paramMap.get('accountId'));
    const referenceId = Number(snapshot.queryParamMap.get('alternatePaymentReferenceId'));
    const aprs = snapshot.data['aprs'] as IOpalFinesAprsResponse;
    const previous = this.currentContext;
    if (
      previous?.accountId === accountId &&
      previous.referenceId === referenceId &&
      previous.aprs === aprs &&
      previous.version === aprs.version
    ) {
      return;
    }

    this.contextChanged.next();
    this.isRemoving.set(false);
    this.currentContext = { accountId, referenceId, aprs, version: aprs.version };
    const { currentReferences, consolidatedReferences } = this.payloadService.transformAprsPayload(aprs);
    const selected = [...currentReferences, ...consolidatedReferences].find(
      (reference) => reference.alternate_payment_reference_id === referenceId,
    );
    this.selectedReference.set(selected ?? null);
    if (!selected?.canRemove) this.handleCancel();
  }

  /** Removes only the selected APR, retaining global HTTP handling for failed requests. */
  public handleRemove(event?: SubmitEvent): void {
    event?.preventDefault();
    const reference = this.selectedReference();
    const context = this.currentContext;
    if (this.isRemoving() || !reference?.canRemove || !context?.version?.trim()) return;

    this.isRemoving.set(true);
    this.api
      .deleteApr(context.accountId, reference.alternate_payment_reference_id, context.version)
      .pipe(
        catchError(() => EMPTY),
        takeUntil(this.contextChanged),
        finalize(() => this.isRemoving.set(false)),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe((response) => {
        this.accountStore.setAccountState({ ...this.accountStore.getAccountState(), base_version: response.version });
        this.api.clearAccountDetailsCache();
        this.accountStore.setSuccessMessage(FINES_ACC_APR_DELETE_SUCCESS_MESSAGE);
        this.handleCancel();
      });
  }

  /** Returns to this account's manage page without submitting a removal. */
  public handleCancel(): void {
    void this.router.navigate(['../', FINES_ACC_APR_ROUTING_PATHS.children.manage], { relativeTo: this.route });
  }

  public ngOnInit(): void {
    this.route.data.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => this.resetReferenceContext());
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe(() => this.resetReferenceContext());
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.contextChanged.complete();
  }
}
