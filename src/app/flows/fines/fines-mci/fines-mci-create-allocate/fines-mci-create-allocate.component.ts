import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { GovukButtonDirective } from '@hmcts/opal-frontend-common/directives/govuk-button';
import { CanDeactivateTypes } from '@hmcts/opal-frontend-common/guards/can-deactivate/types';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { FINES_MCI_ROUTING_PATHS } from '../routing/constants/fines-mci-routing-paths.constant';
import { FinesMciCreateAllocateTableComponent } from './fines-mci-create-allocate-table/fines-mci-create-allocate-table.component';
import { FINES_MCI_CREATE_ALLOCATE_TABLE_SORT_DEFAULT } from './fines-mci-create-allocate-table/constants/fines-mci-create-allocate-table-sort-default.constant';
import { OpalFines } from '../../services/opal-fines-service/opal-fines.service';
import { IFinesMciCreateAllocateTableData } from './fines-mci-create-allocate-table/interfaces/fines-mci-create-allocate-table-data.interface';
import { catchError, map, of, startWith } from 'rxjs';

type FinesMciTillsViewState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'success'; tills: IFinesMciCreateAllocateTableData[] };

@Component({
  selector: 'app-fines-mci-create-allocate',
  imports: [AsyncPipe, RouterLink, GovukButtonDirective, FinesMciCreateAllocateTableComponent],
  templateUrl: './fines-mci-create-allocate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateAllocateComponent {
  private readonly opalFinesService = inject(OpalFines);
  private readonly dateService = inject(DateService);
  protected selectedTillsCount = 0;
  protected readonly financeDashboardRoute = [
    '/',
    FINES_ROUTING_PATHS.root,
    FINES_DASHBOARD_ROUTING_PATHS.root,
    FINES_DASHBOARD_ROUTING_PATHS.children.finance,
  ];
  protected readonly createTillSelectBusinessUnitRoute = [
    '/',
    FINES_ROUTING_PATHS.root,
    FINES_MCI_ROUTING_PATHS.root,
    FINES_MCI_ROUTING_PATHS.children.create,
    FINES_MCI_ROUTING_PATHS.children.till,
    FINES_MCI_ROUTING_PATHS.children.selectBusinessUnit,
  ];
  public readonly tillsState$ = this.opalFinesService
    .getTills({ statuses: ['CREATED', 'FAILED'], auto_payments: false })
    .pipe(
      map(
        ({ tills }): FinesMciTillsViewState => ({
          status: 'success',
          tills: tills.map((till): IFinesMciCreateAllocateTableData => {
            const processedDate = till.date_processed ? this.dateService.getFromIso(till.date_processed) : null;
            const dateCreatedDisplay = processedDate?.isValid
              ? this.dateService.toFormat(processedDate.setLocale('en-gb'), "dd MMMM yyyy 'at' HH:mm")
              : '';

            return {
              tillId: String(till.till_id),
              'Till number': String(till.till_number),
              Payments: till.payments_count,
              Amount: till.amount,
              'Business unit': till.business_unit_name,
              'Created by': till.processed_by,
              'Date created': processedDate?.isValid ? processedDate.toMillis() : null,
              dateCreatedDisplay: dateCreatedDisplay,
            };
          }),
        }),
      ),
      catchError(() => of({ status: 'error' } as const)),
      startWith({ status: 'loading' } as const),
    );
  public readonly tableSort = FINES_MCI_CREATE_ALLOCATE_TABLE_SORT_DEFAULT;

  /** Tracks selected rows so navigation can warn before losing the selection. */
  public handleSelectedTillsCountChange(selectedTillsCount: number): void {
    this.selectedTillsCount = selectedTillsCount;
  }

  /** Prompts before leaving only when the user has selected tills. */
  public canDeactivate(): CanDeactivateTypes {
    return this.selectedTillsCount === 0;
  }
}
