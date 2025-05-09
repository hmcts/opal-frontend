import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, signal, Signal } from '@angular/core';
import { AbstractSortableTablePaginationComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table-pagination';
import { GovukPaginationComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-pagination';
import {
  MojSortableTableComponent,
  MojSortableTableHeaderComponent,
  MojSortableTableRowComponent,
  MojSortableTableRowDataComponent,
  MojSortableTableStatusComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sortable-table';
import { DateFormatPipe } from '@hmcts/opal-frontend-common/pipes/date-format';
import { IFinesMacOffenceDetailsSearchOffencesResultsTableWrapperTableData } from './interfaces/fines-mac-offence-details-search-offences-results-table-wrapper-table-data.interface';
import { IFinesMacOffenceDetailsSearchOffencesResultsTableWrapperTableSort } from './interfaces/fines-mac-offence-details-search-offences-results-table-wrapper-table-sort.interface';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';

@Component({
  selector: 'app-fines-mac-offence-details-search-offences-results-table-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    MojSortableTableComponent,
    MojSortableTableHeaderComponent,
    MojSortableTableRowComponent,
    MojSortableTableRowDataComponent,
    MojSortableTableStatusComponent,
    GovukPaginationComponent,
    DateFormatPipe,
  ],
  templateUrl: './fines-mac-offence-details-search-offences-results-table-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent extends AbstractSortableTablePaginationComponent {
  protected readonly utilsService = inject(UtilsService);
  public override abstractTableDataSignal = signal<IFinesMacOffenceDetailsSearchOffencesResultsTableWrapperTableData[]>(
    [],
  );
  public override paginatedTableDataComputed!: Signal<
    IFinesMacOffenceDetailsSearchOffencesResultsTableWrapperTableData[]
  >;
  public override itemsPerPageSignal = signal(25);
  @Input({ required: true }) set tableData(
    tableData: IFinesMacOffenceDetailsSearchOffencesResultsTableWrapperTableData[],
  ) {
    this.abstractTableDataSignal.set(tableData);
  }

  @Input({ required: true }) set existingSortState(
    existingSortState: IFinesMacOffenceDetailsSearchOffencesResultsTableWrapperTableSort | null,
  ) {
    this.abstractExistingSortState = existingSortState;
  }

  protected readonly DATE_INPUT_FORMAT = `yyyy-MM-dd'T'HH:mm:ss`;
  protected readonly DATE_OUTPUT_FORMAT = 'dd MMM yyyy';
}
