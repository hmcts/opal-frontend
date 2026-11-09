import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { catchError, EMPTY, filter, finalize, Subject, takeUntil } from 'rxjs';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesAprsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-apr.interface';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { IFinesAccAprAddChangeFormState } from './interfaces/fines-acc-apr-add-change-form-state.interface';
import { FINES_ACC_APR_ADD_CHANGE_MODES } from './constants/fines-acc-apr-add-change-modes.constant';
import { FINES_ACC_APR_ADD_CHANGE_TEXT } from './constants/fines-acc-apr-add-change-text.constant';
import { TFinesAccAprAddChangeMode } from './types/fines-acc-apr-add-change-mode.type';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FinesAccAprAddChangeFormComponent } from './fines-acc-apr-add-change-form/fines-acc-apr-add-change-form.component';
import { canAccessAprPage } from '../fines-acc-apr-manage/utils/fines-acc-apr.utils';
import { FINES_ACC_APR_ROUTING_PATHS } from '../fines-acc-apr-manage/constants/fines-acc-apr-routing-paths.constant';

@Component({
  selector: 'app-fines-acc-apr-add-change',
  imports: [FinesAccAprAddChangeFormComponent],
  templateUrl: './fines-acc-apr-add-change.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccAprAddChangeComponent extends AbstractFormParentBaseComponent implements OnInit, OnDestroy {
  private readonly pageRoute = inject(ActivatedRoute);
  private readonly pageRouter = inject(Router);
  private readonly accountStore = inject(FinesAccountStore);
  private readonly api = inject(OpalFines);
  private readonly payloadService = inject(FinesAccPayloadService);
  private readonly utils = inject(UtilsService);
  private readonly ngUnsubscribe = new Subject<void>();
  private readonly contextChanged = new Subject<void>();
  private currentContext: {
    accountId: number;
    mode: TFinesAccAprAddChangeMode;
    aprs: IOpalFinesAprsResponse;
    version: string | null;
  } | null = null;

  public override stateUnsavedChanges = false;
  public readonly formContext = signal({ ...this.pageRoute.snapshot.data });
  public readonly mode = signal<TFinesAccAprAddChangeMode | null>(null);
  public readonly text = computed(
    () => FINES_ACC_APR_ADD_CHANGE_TEXT[this.mode() ?? FINES_ACC_APR_ADD_CHANGE_MODES.ADD],
  );
  public readonly savedValue = computed(() => this.payloadService.transformAprToForm(null).apr_text);
  public readonly initialValue = signal('');
  public readonly pending = signal(false);
  public readonly accountCaption = computed(
    () => `${this.accountStore.getAccountNumber()} - ${this.accountStore.party_name()}`,
  );

  private resetFormContext(): void {
    const snapshot = this.pageRoute.snapshot;
    const mode = snapshot.paramMap.get('mode');
    if (mode !== FINES_ACC_APR_ADD_CHANGE_MODES.ADD) {
      this.contextChanged.next();
      this.currentContext = null;
      this.mode.set(null);
      this.pending.set(false);
      this.stateUnsavedChanges = false;
      this.navigateToManage();
      return;
    }
    const accountId = Number(snapshot.paramMap.get('accountId'));
    const aprs = snapshot.data['aprs'] as IOpalFinesAprsResponse;
    if (!canAccessAprPage(aprs.references, mode, undefined)) {
      this.contextChanged.next();
      this.currentContext = null;
      this.pending.set(false);
      this.stateUnsavedChanges = false;
      this.navigateToManage();
      return;
    }
    const previous = this.currentContext;
    if (
      previous?.accountId === accountId &&
      previous.mode === mode &&
      previous.aprs === aprs &&
      previous.version === aprs.version
    ) {
      return;
    }
    this.contextChanged.next();
    this.currentContext = { accountId, mode, aprs, version: aprs.version };
    this.mode.set(mode);
    this.formContext.set({ ...snapshot.data });
    this.initialValue.set(this.savedValue());
    this.pending.set(false);
    this.stateUnsavedChanges = this.initialValue() !== this.savedValue();
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

  public handleSubmit(form: IAbstractFormBaseForm<IFinesAccAprAddChangeFormState>): void {
    if (this.pending()) return;
    const context = this.currentContext;
    if (!context?.accountId || !context.version?.trim()) {
      this.navigateToManage();
      return;
    }
    const { accountId, mode, version } = context;
    const payload = this.payloadService.buildAprPayload(form.formData);
    const request$ = this.api.createApr(accountId, payload, version);
    this.pending.set(true);
    let saveSucceeded = false;
    request$
      .pipe(
        catchError((error: unknown) => {
          this.handleSubmitError(error);
          return EMPTY;
        }),
        takeUntil(this.contextChanged),
        takeUntil(this.ngUnsubscribe),
        finalize(() => {
          if (!saveSucceeded) this.pending.set(false);
        }),
      )
      .subscribe((response) => {
        saveSucceeded = true;
        this.accountStore.setAccountState({ ...this.accountStore.getAccountState(), base_version: response.version });
        this.api.clearAccountDetailsCache();
        this.accountStore.setSuccessMessage(FINES_ACC_APR_ADD_CHANGE_TEXT[mode].successMessage);
        this.stateUnsavedChanges = false;
        this.navigateToManage();
      });
  }

  public ngOnInit(): void {
    this.pageRoute.data.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => this.resetFormContext());
    this.pageRouter.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe(() => this.resetFormContext());
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.contextChanged.complete();
  }
}
