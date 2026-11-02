import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  GovukTableComponent,
  GovukTableHeadingComponent,
  GovukTableBodyRowComponent,
  GovukTableBodyRowDataComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-table';
import { IFinesAccAprListRow } from '../interfaces/fines-acc-apr-list-row.interface';

@Component({
  selector: 'app-fines-acc-apr-list-table',
  imports: [
    RouterLink,
    GovukTableComponent,
    GovukTableHeadingComponent,
    GovukTableBodyRowComponent,
    GovukTableBodyRowDataComponent,
  ],
  templateUrl: './fines-acc-apr-list-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccAprListTableComponent {
  @Input({ required: true }) public references!: IFinesAccAprListRow[];
  @Input({ required: true }) public tableId!: string;
  @Input() public showActions = true;
}
