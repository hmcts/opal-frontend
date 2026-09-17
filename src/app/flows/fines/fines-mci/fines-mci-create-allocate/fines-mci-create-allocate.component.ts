import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { GovukButtonDirective } from '@hmcts/opal-frontend-common/directives/govuk-button';
import { FinesMciCreateAllocateTableComponent } from './fines-mci-create-allocate-table/fines-mci-create-allocate-table.component';
import { FINES_MCI_CREATE_ALLOCATE_TABLE_SORT_DEFAULT } from './fines-mci-create-allocate-table/constants/fines-mci-create-allocate-table-sort-default.constant';
import { FINES_MCI_CREATE_ALLOCATE_TABLE_DATA_MOCK } from './fines-mci-create-allocate-table/mocks/fines-mci-create-allocate-table-data.mock';
import { FINES_MCI_ROUTING_PATHS } from '../routing/constants/fines-mci-routing-paths.constant';

@Component({
  selector: 'app-fines-mci-create-allocate',
  imports: [RouterLink, GovukButtonDirective, FinesMciCreateAllocateTableComponent],
  templateUrl: './fines-mci-create-allocate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateAllocateComponent {
  protected readonly financeDashboardRoute = [
    '/',
    FINES_ROUTING_PATHS.root,
    FINES_DASHBOARD_ROUTING_PATHS.root,
    FINES_DASHBOARD_ROUTING_PATHS.children.finance,
  ];
  protected readonly createTillRoute = [
    '/',
    FINES_ROUTING_PATHS.root,
    FINES_MCI_ROUTING_PATHS.root,
    ...FINES_MCI_ROUTING_PATHS.children.createTillSelectBusinessUnit.split('/'),
  ];

  public readonly tills = FINES_MCI_CREATE_ALLOCATE_TABLE_DATA_MOCK;
  public readonly tableSort = FINES_MCI_CREATE_ALLOCATE_TABLE_SORT_DEFAULT;
  public readonly tillsAvailable = this.tills.length > 0;
}
