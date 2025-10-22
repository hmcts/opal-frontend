import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MojSortableTableStatusComponent } from '@hmcts/opal-frontend-common/components/moj/moj-sortable-table';

@Component({
  selector: 'app-fines-sa-results-shared-table-status',
  imports: [MojSortableTableStatusComponent],
  template: `
    <ng-container status>
      <opal-lib-moj-sortable-table-status [columnTitle]="columnTitle || ''" [sortDirection]="sortDirection || 'none'" />
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSaResultsSharedTableStatusComponent {
  @Input({ required: true }) columnTitle: string | null = null;
  @Input({ required: true }) sortDirection: 'ascending' | 'descending' | 'none' | null = null;
}
