import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IFinesAccSummaryTabsContentStyles } from '../interfaces/fines-acc-summary-tabs-content-styles.interface';
import { FINES_ACC_SUMMARY_TABS_CONTENT_STYLES } from '../../constants/fines-acc-summary-tabs-content-styles.constant';
import { GovukSummaryCardListComponent,GovukSummaryCardActionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-card-list';
import { IOpalFinesAccountDefendantDetailsEnforcementTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-enforcement-tab-ref-data.interface';
import {
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
  
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { MojBadgeComponent } from '@hmcts/opal-frontend-common/components/moj/moj-badge';
import { FinesNotProvidedComponent } from '../../../components/fines-not-provided/fines-not-provided.component';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { GovukTagComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-tag';
import { GovukDetailsComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-details';
@Component({
  selector: 'app-fines-acc-defendant-details-enforcement-tab',
  imports: [
    GovukSummaryCardListComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    GovukSummaryCardActionComponent,
    MojBadgeComponent,
    FinesNotProvidedComponent,
    DatePipe,
    TitleCasePipe,
    GovukTagComponent,
    GovukDetailsComponent,
],
  templateUrl: './fines-acc-defendant-details-enforcement-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantDetailsEnforcementTab {
  @Input({ required: true }) tabData!: IOpalFinesAccountDefendantDetailsEnforcementTabRefData;
  @Input() style: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;
  @Input() hasAccountMaintenancePermission: boolean = false;
  @Input() hasEnterEnforcementPermission: boolean = false;
}
