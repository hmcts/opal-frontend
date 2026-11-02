import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, finalize, Subject, takeUntil } from 'rxjs';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesAprsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-apr.interface';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { IFinesAccAprAddFormState } from './interfaces/fines-acc-apr-add-form-state.interface';
import { FINES_ACC_APR_ADD_SUCCESS_MESSAGE } from './constants/fines-acc-apr-add-success-message.constant';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FinesAccAprAddFormComponent } from './fines-acc-apr-add-form/fines-acc-apr-add-form.component';
import { FINES_ACC_APR_ROUTING_PATHS } from '../fines-acc-apr-manage/constants/fines-acc-apr-routing-paths.constant';

@Component({
  selector: 'app-fines-acc-apr-add',
  imports: [FinesAccAprAddFormComponent],
  templateUrl: './fines-acc-apr-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccAprAddComponent extends AbstractFormParentBaseComponent {
  private readonly pageRoute = inject(ActivatedRoute);
  private readonly pageRouter = inject(Router);
  private readonly accountStore = inject(FinesAccountStore);
  private readonly api = inject(OpalFines);
  private readonly payloadService = inject(FinesAccPayloadService);
  private readonly utils = inject(UtilsService);
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
      this.initialValue.set(this.payloadService.transformAprToForm(null).apr_text);
      this.pending.set(false);
      this.stateUnsavedChanges = this.initialValue() !== '';
    });
  }

  private handleSubmitError(error: unknown): void {
    this.stateUnsavedChanges = !(error instanceof HttpErrorResponse && error.error?.retriable === false);
    this.utils.scrollToTop();
  }

  public navigateToManage(): void {
    void this.pageRouter.navigate(['../', FINES_ACC_APR_ROUTING_PATHS.children.manage], {
      relativeTo: this.pageRoute,
    });
  }

  public handleCancel(): void {
    this.navigateToManage();
  }

  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.stateUnsavedChanges = unsavedChanges;
  }

  public handleSubmit(form: IAbstractFormBaseForm<IFinesAccAprAddFormState>): void {
    if (this.pending()) return;
    const accountId = Number(this.pageRoute.snapshot.paramMap.get('accountId'));
    const { version } = this.formContext()['aprs'] as IOpalFinesAprsResponse;
    if (!accountId || !version?.trim()) {
      this.navigateToManage();
      return;
    }

    const payload = this.payloadService.buildAprPayload(form.formData);
    this.pending.set(true);
    this.api
      .createApr(accountId, payload, version)
      .pipe(
        catchError((error: unknown) => {
          this.handleSubmitError(error);
          return EMPTY;
        }),
        takeUntil(this.contextChanged),
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.pending.set(false)),
      )
      .subscribe((response) => {
        this.accountStore.setAccountState({ ...this.accountStore.getAccountState(), base_version: response.version });
        this.api.clearAccountDetailsCache();
        this.accountStore.setSuccessMessage(FINES_ACC_APR_ADD_SUCCESS_MESSAGE);
        this.stateUnsavedChanges = false;
        this.navigateToManage();
      });
  }
}
