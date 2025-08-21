import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { GovukTaskListComponent, GovukTaskListItemComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-task-list';
import { IOpalFinesAccountDetailsAtAGlanceTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-details-tab-ref-data.interface';
import { GovukListLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-list/govuk-list-link';
import { GovukListComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-list';
import { CustomActionLinksComponent } from '@hmcts/opal-frontend-common/components/custom/custom-action-links';
import { UpperCasePipe } from '@angular/common';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { GovukTagComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-tag';
import { MojBadgeComponent } from '@hmcts/opal-frontend-common/components/moj/moj-badge';

@Component({
  selector: 'app-fines-acc-defendant-details-at-a-glance-tab',
  imports: [GovukTaskListComponent, GovukTaskListItemComponent, GovukListLinkComponent, GovukListComponent, CustomActionLinksComponent, UpperCasePipe, GovukTagComponent, MojBadgeComponent],
  templateUrl: './fines-acc-defendant-details-at-a-glance-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantDetailsAtAGlanceTabComponent {
  @Input() tabData!: IOpalFinesAccountDetailsAtAGlanceTabRefData | null;
  public readonly dateService = new DateService();
  public readonly utilsService = new UtilsService();

  public headingStyle = 'govuk-heading-s govuk-!-margin-bottom-2 govuk-!-margin-top-2';
  public headingHrStyle = 'govuk-section-break govuk-section-break--m govuk-section-break--visible custom-section-break--4px govuk-!-margin-bottom-3 govuk-!-margin-top-0';
  public keyStyle = 'govuk-!-font-size-16 govuk-!-font-weight-bold govuk-!-margin-top-0 govuk-!-margin-bottom-1 govuk-body';
  public valueStyle = 'govuk-!-font-size-16  govuk-!-margin-top-0 govuk-!-margin-bottom-2 govuk-body';
}
