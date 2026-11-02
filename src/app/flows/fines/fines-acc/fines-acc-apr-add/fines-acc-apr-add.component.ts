import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesAprsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-apr.interface';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FinesAccAprFormComponent } from '../fines-acc-apr/fines-acc-apr-form.component';
import { FINES_ACC_APR_ROUTING_PATHS } from '../routing/constants/fines-acc-apr-routing-paths.constant';
import { FINES_ACC_APR_DUPLICATE_MESSAGE, FinesAccAprErrorService } from '../fines-acc-apr/fines-acc-apr-error.service';
import { isAprDuplicate } from '@app/interceptors/fines-acc-apr-http-error.interceptor';

@Component({
  selector: 'app-fines-acc-apr-add',
  imports: [FinesAccAprFormComponent],
  templateUrl: './fines-acc-apr-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccAprAddComponent extends AbstractFormParentBaseComponent {
  private readonly pageRoute = inject(ActivatedRoute);
  private readonly pageRouter = inject(Router);
  private readonly accountStore = inject(FinesAccountStore);
  private readonly api = inject(OpalFines);
  private readonly utils = inject(UtilsService);
  private readonly errorService = inject(FinesAccAprErrorService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly contextChanged = new Subject<void>();

  public override stateUnsavedChanges = false;
  public readonly formContext = toSignal(this.pageRoute.data, { initialValue: this.pageRoute.snapshot.data });
  public readonly initialValue = signal('');
  public readonly pending = signal(false);
  public readonly accountCaption = computed(
    () => `${this.accountStore.getAccountNumber()} - ${this.accountStore.party_name()}`,
  );

  constructor() {
    super();
    this.pageRoute.data.pipe(takeUntilDestroyed()).subscribe(() => {
      this.contextChanged.next();
      const accountId = Number(this.pageRoute.snapshot.paramMap.get('accountId'));
      this.initialValue.set(this.errorService.consumeDraft(accountId, 'add') ?? '');
      this.pending.set(false);
      this.stateUnsavedChanges = this.initialValue() !== '';
    });
  }

  public navigateToList(): void {
    void this.pageRouter.navigate(['../', FINES_ACC_APR_ROUTING_PATHS.children.list], {
      relativeTo: this.pageRoute,
    });
  }

  public handleSave(aprText: string): void {
    if (this.pending()) return;
    const accountId = Number(this.pageRoute.snapshot.paramMap.get('accountId'));
    const { version } = this.formContext()['aprs'] as IOpalFinesAprsResponse;
    if (!accountId || !version?.trim()) {
      this.navigateToList();
      return;
    }

    this.pending.set(true);
    this.api
      .createApr(accountId, { apr_text: aprText }, version)
      .pipe(
        takeUntil(this.contextChanged),
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.pending.set(false)),
      )
      .subscribe({
        next: (response) => {
          this.accountStore.setAccountState({ ...this.accountStore.getAccountState(), base_version: response.version });
          this.api.clearAccountDetailsCache();
          this.accountStore.setSuccessMessage('Alternate payment reference added');
          this.stateUnsavedChanges = false;
          this.navigateToList();
        },
        error: (error: unknown) => this.handleSaveError(error, aprText),
      });
  }

  public handleSaveError(error: unknown, aprText: string): void {
    if (isAprDuplicate(error)) {
      this.errorService.remember({
        accountId: Number(this.pageRoute.snapshot.paramMap.get('accountId')),
        action: 'add',
        text: aprText,
        message: FINES_ACC_APR_DUPLICATE_MESSAGE,
      });
      this.stateUnsavedChanges = false;
      void this.pageRouter.navigate(['../error'], { relativeTo: this.pageRoute });
      return;
    }
    this.stateUnsavedChanges = !(error instanceof HttpErrorResponse && error.error?.retriable === false);
    this.utils.scrollToTop();
  }
}
