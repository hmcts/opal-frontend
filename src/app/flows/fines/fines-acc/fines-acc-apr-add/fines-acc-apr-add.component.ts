import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
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
      this.initialValue.set('');
      this.pending.set(false);
      this.stateUnsavedChanges = false;
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
        error: () => this.handleSaveError(),
      });
  }

  public handleSaveError(): void {
    this.stateUnsavedChanges = true;
    this.utils.scrollToTop();
  }
}
