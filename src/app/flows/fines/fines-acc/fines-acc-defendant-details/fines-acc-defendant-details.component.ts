import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
@Component({
  selector: 'app-fines-acc-defendant-details',
  imports: [
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
export class FinesAccDefendantDetailsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  public readonly utilsService = inject(UtilsService);
  public accountData!: IOpalFinesDefendantAccountHeader;
  public businessUnit!: IOpalFinesBusinessUnitNonSnakeCase;
  public activeTab!: string;

  constructor() {}

  public linkClickEvent(): void {
    // This method can be used to handle link click events if needed.
    // Currently, it does nothing but can be extended in the future.
  }

  public addAccountNote(): void {
    this.router.navigate([`../${FINES_ACC_ROUTING_PATHS.children.note}/add`], { relativeTo: this.activatedRoute });
  }

  public handleTabSwitch(fragment: string): void {
    this.activeTab = fragment;
  }

  ngOnInit(): void {
    this.accountData = this.activatedRoute.snapshot.data['headerDataAndBusinessUnit'].headingData;
    this.businessUnit = this.activatedRoute.snapshot.data['headerDataAndBusinessUnit'].businessUnit;
    this.activeTab = this.activatedRoute.snapshot.fragment || 'at-a-glance';
  }
}
