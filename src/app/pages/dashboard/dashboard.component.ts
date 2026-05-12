import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { DashboardPage } from '@hmcts/opal-frontend-common/pages/dashboard-page';
import { map } from 'rxjs';
import { DASHBOARD_PAGE_CONFIGURATION_MAP, isDashboardPageType } from './constants/dashboard-config.constant';
import { IDashboardPageConfiguration } from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';
import { DASHBOARD_PAGE_DEFAULT_TAB } from './constants/dashboard-config-default-tab.constant';
import { DASHBOARD_CONFIG_DEFAULT_DASHBOARD } from './constants/dashboard-config-default-dashboard.constant';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardPage],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly globalStore = inject(GlobalStore);

  /**
   * Creates a signal that tracks the 'dashboardType' route parameter. This signal updates whenever the route parameters change, allowing the component to reactively determine which dashboard configuration to use based on the current URL. The initial value is set to null, indicating that no specific dashboard type has been selected yet.
   */
  private readonly dashboardType = toSignal(
    this.activatedRoute.paramMap.pipe(map((paramMap) => paramMap.get('dashboardType'))),
    { initialValue: null },
  );

  /**
   * Resolves the dashboard configuration based on the current route parameter 'dashboardType'. If the parameter is valid and corresponds to a known dashboard type, it returns the specific configuration for that type. If the parameter is missing or invalid, it falls back to the default dashboard configuration defined in DASHBOARD_CONFIG_DEFAULT_DASHBOARD. Should the 'release-1a' feature flag be false, and the resolved configuration pertains to the 'accounts' dashboard, it filters out the 'draft-accounts' group from the configuration before returning it. This ensures that certain features are conditionally available based on the feature flag, allowing for dynamic adjustments to the dashboard's content without requiring changes to the underlying configuration objects.
   */
  public readonly resolvedConfig = computed<IDashboardPageConfiguration>(() => {
    const dashboardType = this.dashboardType();
    const isRelease1aEnabled = this.globalStore.featureFlags()['release-1a'];

    const filterDraftAccounts = (config: IDashboardPageConfiguration): IDashboardPageConfiguration => ({
      ...config,
      groups: config.groups.filter((group) => group.id !== 'draft-accounts'),
    });

    if (dashboardType && isDashboardPageType(dashboardType)) {
      const config = DASHBOARD_PAGE_CONFIGURATION_MAP[dashboardType];

      return !isRelease1aEnabled && config.title === 'Accounts' ? filterDraftAccounts(config) : config;
    }

    const defaultConfig =
      DASHBOARD_PAGE_CONFIGURATION_MAP[DASHBOARD_PAGE_DEFAULT_TAB] ?? DASHBOARD_CONFIG_DEFAULT_DASHBOARD;

    return !isRelease1aEnabled && defaultConfig.title === 'Accounts'
      ? filterDraftAccounts(defaultConfig)
      : defaultConfig;
  });
}
