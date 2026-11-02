import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  GovukTableComponent,
  GovukTableHeadingComponent,
  GovukTableBodyRowComponent,
  GovukTableBodyRowDataComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-table';
import { IFinesAccAprManageRow } from '../interfaces/fines-acc-apr-manage-row.interface';

@Component({
  selector: 'app-fines-acc-apr-manage-table',
  imports: [
    RouterLink,
    GovukTableComponent,
    GovukTableHeadingComponent,
    GovukTableBodyRowComponent,
    GovukTableBodyRowDataComponent,
  ],
  templateUrl: './fines-acc-apr-manage-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccAprManageTableComponent {
  @Input({ required: true }) public references!: IFinesAccAprManageRow[];
  @Input({ required: true }) public tableId!: string;
  @Input() public showActions = true;
}
