import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  GovukTableComponent,
  GovukTableHeadingComponent,
  GovukTableBodyRowComponent,
  GovukTableBodyRowDataComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-table';
import { IOpalFinesApr } from '@services/fines/opal-fines-service/interfaces/opal-fines-apr.interface';
import { canChangeApr, canRemoveApr, formatAprDate } from './fines-acc-apr.utils';

@Component({
  selector: 'app-fines-acc-apr-table',
  imports: [
    RouterLink,
    GovukTableComponent,
    GovukTableHeadingComponent,
    GovukTableBodyRowComponent,
    GovukTableBodyRowDataComponent,
  ],
  templateUrl: './fines-acc-apr-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccAprTableComponent {
  @Input({ required: true }) public references!: IOpalFinesApr[];
  @Input({ required: true }) public tableId!: string;
  @Input() public showActions = true;
  public readonly canChange = canChangeApr;
  public readonly canRemove = canRemoveApr;
  public readonly formatDate = formatAprDate;
}
