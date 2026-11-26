import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { catchError, EMPTY, finalize, Subject, takeUntil } from 'rxjs';
import { FINES_AEC_SUCCESS_MESSAGES } from '../constants/fines-aec-success-messages.constant';
import { IFinesAecAccountTypeRow } from '../interfaces/fines-aec-account-type-row.interface';
import { FINES_AEC_ROUTING_PATHS } from '../routing/constants/fines-aec-routing-paths.constant';
import { FinesAecPayloadService } from '../services/fines-aec-payload.service';
import { FinesAecStore } from '../stores/fines-aec.store';
import { FINES_AEC_AMEND_VALUES_FORM_STATE } from './constants/fines-aec-amend-values-form-state.constant';
import { FinesAecAmendValuesFormComponent } from './fines-aec-amend-values-form/fines-aec-amend-values-form.component';
import { IFinesAecAmendValuesFormState } from './interfaces/fines-aec-amend-values-form-state.interface';

@Component({
  selector: 'app-fines-aec-amend-values',
  imports: [FinesAecAmendValuesFormComponent],
  templateUrl: './fines-aec-amend-values.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAecAmendValuesComponent extends AbstractFormParentBaseComponent implements OnInit, OnDestroy {
  private readonly pageRoute = inject(ActivatedRoute);
  private readonly pageRouter = inject(Router);
  private readonly api = inject(OpalFines);
  private readonly payloadService = inject(FinesAecPayloadService);
  private readonly store = inject(FinesAecStore);
  private readonly utils = inject(UtilsService);
  private readonly destroy$ = new Subject<void>();
  private readonly contextChanged$ = new Subject<void>();

  public override stateUnsavedChanges = false;
  public readonly accountType = signal<IFinesAecAccountTypeRow | null>(null);
  public readonly initialValues = signal<IFinesAecAmendValuesFormState>({ ...FINES_AEC_AMEND_VALUES_FORM_STATE });
  public readonly pending = signal(false);

  /**
   * Resets the form and cancels any pending save when the resolved account type changes.
   * @param accountType - The low/high enforcement paths loaded by the route resolver.
   */
  private setFormContext(accountType: IFinesAecAccountTypeRow | undefined): void {
    this.contextChanged$.next();
    this.pending.set(false);
    this.stateUnsavedChanges = false;
    this.store.clearSuccessMessage();
    this.accountType.set(accountType ?? null);
    if (!accountType) {
      this.navigateToAccountTypes();
      return;
    }
    this.initialValues.set(this.payloadService.transformAccountTypeToAmendValuesForm(accountType));
  }

  /** Returns to the Account types tab, allowing the shared route guard to protect unsaved edits. */
  public navigateToAccountTypes(): void {
    void this.pageRouter.navigate(['..', FINES_AEC_ROUTING_PATHS.children.config], {
      relativeTo: this.pageRoute,
      fragment: 'account-types',
    });
  }

  /** Cancels editing through the guarded return route without creating a success notification. */
  public handleCancel(): void {
    this.navigateToAccountTypes();
  }

  /**
   * Keeps the route and browser-unload guards in sync with the child form.
   * @param unsavedChanges - Whether either amount differs from its saved value.
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.stateUnsavedChanges = unsavedChanges;
  }

  /**
   * Saves both enforcement paths with their original versions and returns to refreshed Account types on success.
   * Unchanged values return without PATCH; failed saves retain edits and permit retry.
   * @param form - Validated monetary values emitted by the child form.
   */
  public handleSubmit(form: IAbstractFormBaseForm<IFinesAecAmendValuesFormState>): void {
    if (this.pending()) return;
    const accountType = this.accountType();
    if (!accountType?.highValueAccountType) {
      this.navigateToAccountTypes();
      return;
    }
    const payload = this.payloadService.buildAmendValuesPayload(accountType, form.formData);
    const savedBalances = new Map(
      [accountType.lowValueAccountType, accountType.highValueAccountType].map((record) => [
        record.id,
        record.minimum_balance ?? null,
      ]),
    );
    if (payload.every((update) => update.minimum_balance === savedBalances.get(update.id))) {
      this.stateUnsavedChanges = false;
      this.navigateToAccountTypes();
      return;
    }

    this.pending.set(true);
    let saveSucceeded = false;
    this.api
      .updateEnforcementAccountTypes(payload)
      .pipe(
        catchError((error: unknown) => {
          this.stateUnsavedChanges = !(error instanceof HttpErrorResponse && error.error?.retriable === false);
          this.utils.scrollToTop();
          return EMPTY;
        }),
        takeUntil(this.contextChanged$),
        takeUntil(this.destroy$),
        finalize(() => {
          if (!saveSucceeded) this.pending.set(false);
        }),
      )
      .subscribe(() => {
        saveSucceeded = true;
        this.store.setSuccessMessage(FINES_AEC_SUCCESS_MESSAGES.amendValues);
        this.stateUnsavedChanges = false;
        this.navigateToAccountTypes();
      });
  }

  /** Loads the resolved account type and responds to guarded query-parameter changes on the reused route. */
  public ngOnInit(): void {
    this.pageRoute.data
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => this.setFormContext(data['enforcementAccountType'] as IFinesAecAccountTypeRow | undefined));
  }

  /** Releases route and save subscriptions so a late response cannot update a different account type. */
  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.contextChanged$.complete();
  }
}
