import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustomAccessibleMonetaryComponent } from '@hmcts/opal-frontend-common/components/custom/custom-accessible-monetary';
import {
  GovukTableComponent,
  GovukTableHeadingComponent,
  GovukTableBodyRowComponent,
  GovukTableBodyRowDataComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-table';
import { IFinesAecAccountTypeRow } from '../../../interfaces/fines-aec-account-type-row.interface';
import { FINES_AEC_ROUTING_PATHS } from '../../../routing/constants/fines-aec-routing-paths.constant';

@Component({
  selector: 'app-fines-aec-account-types-table',
  imports: [
    RouterLink,
    CustomAccessibleMonetaryComponent,
    GovukTableComponent,
    GovukTableHeadingComponent,
    GovukTableBodyRowComponent,
    GovukTableBodyRowDataComponent,
  ],
  templateUrl: './fines-aec-account-types-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAecAccountTypesTableComponent {
  @Input({ required: true }) public accountTypes!: IFinesAecAccountTypeRow[];
  public readonly routingPaths = FINES_AEC_ROUTING_PATHS;
}
