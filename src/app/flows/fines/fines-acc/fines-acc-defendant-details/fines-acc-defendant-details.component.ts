import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IOpalFinesDefendantAccountHeader } from './interfaces/fines-acc-defendant-account-header.interface';
import { IOpalFinesBusinessUnitNonSnakeCase } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { FINES_ACC_ROUTING_PATHS } from '../routing/constants/fines-acc-routing-paths.constant';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FinesAccDetailsAccountInfoComponent } from '../components/fines-acc-details-account-info/fines-acc-details-account-info.component';
import { FinesAccDetailsAccountInfoBlockComponent } from '../components/fines-acc-details-account-info-block/fines-acc-details-account-info-block.component';
import { FinesAccDetailsAccountHeadingComponent } from '../components/fines-acc-details-account-heading/fines-acc-details-account-heading.component';
import { FinesAccDefendantDetailsAtAGlanceTabComponent } from './fines-acc-defendant-details-at-a-glance-tab/fines-acc-defendant-details-at-a-glance-tab.component';
import {
  MojSubNavigationComponent,
  MojSubNavigationItemComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sub-navigation';
import { AbstractTabData } from '@hmcts/opal-frontend-common/components/abstract/abstract-tab-data';
import { Observable, Subject } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesAccountDetailsAtAGlanceTabRefData, IOpalFinesAccountDetailsDefendantTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-details-tab-ref-data.interface';
import { AsyncPipe, JsonPipe } from '@angular/common';
@Component({
  selector: 'app-fines-acc-defendant-details',
  imports: [
    AsyncPipe,
    JsonPipe,
    FinesAccDetailsAccountInfoComponent,
    FinesAccDetailsAccountInfoBlockComponent,
    FinesAccDetailsAccountHeadingComponent,
    FinesAccDefendantDetailsAtAGlanceTabComponent,
    MojSubNavigationComponent,
    MojSubNavigationItemComponent,
  ],
  templateUrl: './fines-acc-defendant-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantDetailsComponent extends AbstractTabData implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly opalFinesService = inject(OpalFines);
  public tabData$ = new Observable<IOpalFinesAccountDetailsAtAGlanceTabRefData>();
  public readonly utilsService = inject(UtilsService);
  public accountData!: IOpalFinesDefendantAccountHeader;
  public businessUnit!: IOpalFinesBusinessUnitNonSnakeCase;

  private getDataFromRoute(): void {
    this.accountData = this.activatedRoute.snapshot.data['headerDataAndBusinessUnit'].headingData;
    this.businessUnit = this.activatedRoute.snapshot.data['headerDataAndBusinessUnit'].businessUnit;
    this.activeTab = this.activatedRoute.snapshot.fragment || 'at-a-glance';
  }

  /**
   * Initializes and sets up the observable data stream for the fines draft tab component.
   *
   * This method listens to changes in the route fragment (representing the active tab),
   * and updates the tab data stream accordingly. It uses the provided initial tab,
   * and constructs the necessary parameters for fetching and populating the tab's table data.
   *
   */
  private setupTabDataStream(): void {
    const fragment$ = this.clearCacheOnTabChange(this.getFragmentStream('at-a-glance', this.destroy$), () =>
      this.opalFinesService.clearAccountDetailsCache(),
    );

    this.tabData$ = this.createTabDataStream<
      IOpalFinesAccountDetailsAtAGlanceTabRefData,
      IOpalFinesAccountDetailsAtAGlanceTabRefData
    >(
      fragment$,
      (tab) => tab,
      (tab) => this.opalFinesService.getDefendantAccountAtAGlance(tab, this.accountData.id),
      (res) => res,
    );
  }

  public linkClickEvent(): void {
    // This method can be used to handle link click events if needed.
    // Currently, it does nothing but can be extended in the future.
  }

  public navigateToAddAccountNotePage(): void {
    this['router'].navigate([`../${FINES_ACC_ROUTING_PATHS.children.note}/add`], { relativeTo: this.activatedRoute });
  }

  public ngOnInit(): void {
    this.getDataFromRoute();
    this.setupTabDataStream();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
