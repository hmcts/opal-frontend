import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IFinesAccSummaryTabsContentStyles } from '../interfaces/fines-acc-summary-tabs-content-styles.interface';
import { FINES_ACC_SUMMARY_TABS_CONTENT_STYLES } from '../../constants/fines-acc-summary-tabs-content-styles.constant';
import { IOpalFinesAccountDefendantDetailsFixedPenaltyTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-fixed-penalty-tab-ref-data.interface';
import { DatePipe } from '@angular/common';
import { GovukSummaryCardListComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-card-list';
import {
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { FinesNotProvidedComponent } from '../../../components/fines-not-provided/fines-not-provided.component';

@Component({
  selector: 'app-fines-acc-defendant-details-fixed-penalty-tab',
  imports: [
    DatePipe,
    GovukSummaryCardListComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    FinesNotProvidedComponent,
  ],
  templateUrl: './fines-acc-defendant-details-fixed-penalty-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantDetailsFixedPenaltyTabComponent {
  @Input({ required: true }) tabData!: IOpalFinesAccountDefendantDetailsFixedPenaltyTabRefData;
  @Input() style: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;
}
