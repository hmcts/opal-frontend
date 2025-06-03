import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  MojSubNavigationComponent,
  MojSubNavigationItemComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sub-navigation';
import { FinesDraftTableWrapperComponent } from '../../fines-draft-table-wrapper/fines-draft-table-wrapper.component';
import { Observable, Subject } from 'rxjs';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FINES_DRAFT_CHECK_AND_VALIDATE_ROUTING_PATHS } from '../routing/constants/fines-draft-check-and-validate-routing-paths.constant';
import {
  FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT,
  FINES_DRAFT_TABLE_WRAPPER_SORT_DELETED,
} from '../../fines-draft-table-wrapper/constants/fines-draft-table-wrapper-table-sort.constants';
import { CommonModule } from '@angular/common';
import { IFinesDraftTableWrapperTableData } from '../../fines-draft-table-wrapper/interfaces/fines-draft-table-wrapper-table-data.interface';
import { IOpalFinesDraftAccountsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-data.interface';
import { FINES_DRAFT_TAB_STATUSES } from '../../constants/fines-draft-tab-statuses.constant';
import { FinesDraftService } from '../../services/fines-draft.service';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { AbstractTabData } from '@hmcts/opal-frontend-common/components/abstract/abstract-tab-data';
import { IOpalFinesDraftAccountParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-params.interface';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';

@Component({
  selector: 'app-fines-draft-check-and-validate-tabs',
  imports: [CommonModule, MojSubNavigationComponent, MojSubNavigationItemComponent, FinesDraftTableWrapperComponent],
  templateUrl: './fines-draft-check-and-validate-tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesDraftCheckAndValidateTabsComponent extends AbstractTabData implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly globalStore = inject(GlobalStore);
  private readonly opalFinesService = inject(OpalFines);
  private readonly dateService = inject(DateService);
  public readonly finesDraftService = inject(FinesDraftService);

  private readonly userState = this.globalStore.userState();
  private readonly businessUnitIds = this.userState.business_unit_user.map(
    (business_unit_user) => business_unit_user.business_unit_id,
  );
  private readonly businessUnitUserIds = this.userState.business_unit_user.map(
    (business_unit_user) => business_unit_user.business_unit_user_id,
  );

  protected readonly finesDraftCheckAndValidateRoutingPaths = FINES_DRAFT_CHECK_AND_VALIDATE_ROUTING_PATHS;

  public tabData$!: Observable<IFinesDraftTableWrapperTableData[]>;
  public tableSort = FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT;

  /**
   * Initializes and sets up the observable data stream for the fines draft tab component.
   *
   * This method listens to changes in the route fragment (representing the active tab),
   * and updates the tab data stream accordingly. It uses the provided initial tab,
   * and constructs the necessary parameters for fetching and populating the tab's table data.
   *
   */
  private setupTabDataStream(): void {
    const fragment$ = this.clearCacheOnTabChange(this.getFragmentStream('to-review', this.destroy$), () =>
      this.opalFinesService.clearDraftAccountsCache(),
    );

    this.tabData$ = this.createTabDataStream<IOpalFinesDraftAccountsResponse, IFinesDraftTableWrapperTableData[]>(
      fragment$,
      (tab) => {
        if (tab === 'deleted') {
          this.tableSort = FINES_DRAFT_TABLE_WRAPPER_SORT_DELETED;
        } else {
          this.tableSort = FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT;
        }

        const currentTab = FINES_DRAFT_TAB_STATUSES.find((t) => t.tab === tab);

        const params: IOpalFinesDraftAccountParams = {
          businessUnitIds: this.businessUnitIds,
          statuses: currentTab?.statuses,
          submittedBy: this.businessUnitUserIds,
        };

        if (currentTab?.historicWindowInDays) {
          const { from, to } = this.dateService.getDateRange(currentTab.historicWindowInDays, 0);
          params.accountStatusDateFrom = [from];
          params.accountStatusDateTo = [to];
        }

        return params;
      },
      (params) => this.opalFinesService.getDraftAccounts(params),
      (res) => this.finesDraftService.populateTableData(res),
    );
  }

  public ngOnInit(): void {
    this.setupTabDataStream();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
