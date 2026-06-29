import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IOpalFinesAccountDefendantAtAGlance } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-at-a-glance.interface';
import { UpperCasePipe } from '@angular/common';
import { GovukTagComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-tag';
import { MojBadgeComponent } from '@hmcts/opal-frontend-common/components/moj/moj-badge';
import { FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS } from '../../../fines-mac/fines-mac-language-preferences/constants/fines-mac-language-preferences-options';
import { IFinesAccSummaryTabsContentStyles } from '../interfaces/fines-acc-summary-tabs-content-styles.interface';
import { FINES_ACC_SUMMARY_TABS_CONTENT_STYLES } from '../../constants/fines-acc-summary-tabs-content-styles.constant';
import { FINES_ACC_DEBTOR_TYPES } from '../../constants/fines-acc-debtor-types.constant';
import { NationalInsurancePipe } from '@hmcts/opal-frontend-common/pipes/national-insurance';
import { FinesNotProvidedComponent } from '../../../components/fines-not-provided/fines-not-provided.component';
import { DateFormatPipe } from '@hmcts/opal-frontend-common/pipes/date-format';
import { MonetaryPipe } from '@hmcts/opal-frontend-common/pipes/monetary';
import { RouterLink } from '@angular/router';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../routing/constants/fines-acc-defendant-routing-paths.constant';

@Component({
  selector: 'app-fines-acc-defendant-details-at-a-glance-tab',
  imports: [
    UpperCasePipe,
    GovukTagComponent,
    MojBadgeComponent,
    NationalInsurancePipe,
    FinesNotProvidedComponent,
    DateFormatPipe,
    MonetaryPipe,
    RouterLink,
  ],
  templateUrl: './fines-acc-defendant-details-at-a-glance-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantDetailsAtAGlanceTabComponent {
  @Input({ required: true }) tabData!: IOpalFinesAccountDefendantAtAGlance;
  @Input() hasAccountMaintenencePermission: boolean = false;
  @Input() style: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;
  @Input() hasAccountMaintenancePermissionInBU: boolean = false;
  public readonly languages = FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS;
  public readonly debtorTypes = FINES_ACC_DEBTOR_TYPES;

  /**
   * Navigates to the add comments page.
   * If the user lacks the required permission in this BU, navigates to the access-denied page instead.
   */
  public navigateToAddCommentsPage(): string {
    return this.hasAccountMaintenancePermissionInBU
      ? `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.comments}/add`
      : '/access-denied';
  }
}
