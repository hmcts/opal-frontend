import { AsyncPipe, KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import {
  MojSubNavigationComponent,
  MojSubNavigationItemComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sub-navigation';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { catchError, distinctUntilChanged, EMPTY, map, Observable } from 'rxjs';
import { FINES_DASHBOARD_ROUTING_PATHS } from '../../constants/fines-dashboard-routing-paths.constant';
import { FINES_AEC_TABS } from '../constants/fines-aec-tabs.constant';
import { FinesAecAccountTypesTabComponent } from './fines-aec-account-types-tab/fines-aec-account-types-tab.component';
import { FinesAecPlaceholderComponent } from '../fines-aec-placeholder/fines-aec-placeholder.component';
import { IFinesAecAccountTypeRow } from '../interfaces/fines-aec-account-type-row.interface';
import { FinesAecPayloadService } from '../services/fines-aec-payload.service';
import { FinesAecStore } from '../stores/fines-aec.store';
import { FinesAecTab } from '../types/fines-aec-tab.type';

@Component({
  selector: 'app-fines-aec-config',
  imports: [
    AsyncPipe,
    KeyValuePipe,
    GovukBackLinkComponent,
    MojSubNavigationComponent,
    MojSubNavigationItemComponent,
    FinesAecAccountTypesTabComponent,
    FinesAecPlaceholderComponent,
  ],
  templateUrl: './fines-aec-config.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAecConfigComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly opalFines = inject(OpalFines);
  private readonly payloadService = inject(FinesAecPayloadService);

  public readonly store = inject(FinesAecStore);
  public readonly tabs = FINES_AEC_TABS;
  public readonly successMessage = signal<string | null>(null);
  public accountTypes$: Observable<IFinesAecAccountTypeRow[]> = EMPTY;

  /**
   * Consumes any amendment success message and tracks the selected tab through URL fragment changes.
   * Missing or unknown fragments default to Account types; its data stream is prepared only when that tab is selected.
   * Each new Account types selection refreshes the cached national thresholds.
   * The fragment subscription is released when this component is destroyed.
   */
  public ngOnInit(): void {
    this.successMessage.set(this.store.successMessage());
    this.store.clearSuccessMessage();
    this.activatedRoute.fragment
      .pipe(
        map(
          (fragment): FinesAecTab =>
            fragment && Object.hasOwn(this.tabs, fragment) ? (fragment as FinesAecTab) : 'account-types',
        ),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((tab) => {
        this.store.setActiveTab(tab);
        if (tab === 'account-types') {
          this.opalFines.clearCache('enforcementAccountTypesCache$');
          this.accountTypes$ = this.opalFines.getEnforcementAccountTypes().pipe(
            map((response) => this.payloadService.transformAccountTypesForView(response)),
            // The shared HTTP interceptor presents request errors in the global banner.
            catchError(() => EMPTY),
          );
        }
      });
  }

  /** Returns to the Administration dashboard where the configuration flow is entered. */
  public navigateBack(): void {
    void this.router.navigate([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.administration,
    ]);
  }
}
