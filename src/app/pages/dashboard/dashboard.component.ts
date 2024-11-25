import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { GlobalStateService } from '@services/global-state-service/global-state.service';
import { CommonModule } from '@angular/common';
import { IObjectSortableInterface } from '@services/sort-service/interfaces/sort-service-interface';
import { TableWrapComponent } from './table-wrap/table-wrap.component';
import { ISortState } from './table-wrap/Interfaces/table-wrap-interfaces';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, TableWrapComponent],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  public readonly globalStateService = inject(GlobalStateService);
  public readonly finesRoutingPaths = FINES_ROUTING_PATHS;

  public active: string = 'nav1';

  tableData: IObjectSortableInterface[] = [
    {
      imposition: 'Imposition 1',
      creditor: 'major',
      amountImposed: 1000,
      amountPaid: 200,
      balanceRemaining: 800,
    },
    {
      imposition: 'Imposition 2',
      creditor: 'minor',
      amountImposed: 1500,
      amountPaid: 500,
      balanceRemaining: 1000,
    },
    {
      imposition: 'Imposition 3',
      creditor: 'default',
      amountImposed: 2000,
      amountPaid: 1000,
      balanceRemaining: 1000,
    },
  ];

  public existingState: ISortState = {
    imposition: 'ascending',
    creditor: 'none',
    amountImposed: 'none',
    amountPaid: 'none',
    balanceRemaining: 'none',
  };

  public handleEmit($event: any): void {
    console.log('Emit', $event);
  }
}
