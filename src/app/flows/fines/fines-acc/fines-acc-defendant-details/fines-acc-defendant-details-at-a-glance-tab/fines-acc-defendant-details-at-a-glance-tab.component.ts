import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FinesAccDetailsAccountDataBlockComponent } from '../../components/fines-acc-details-account-data-block/fines-acc-details-account-data-block.component';
import { CustomActionLinksComponent } from '@hmcts/opal-frontend-common/components/custom/custom-action-links';
import { GovukListComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-list';
import { GovukListLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-list/govuk-list-link';
import { IOpalFinesAccountDetailsAtAGlanceTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-details-tab-ref-data.interface';

@Component({
  selector: 'app-fines-acc-defendant-details-at-a-glance-tab',
  imports: [
    FinesAccDetailsAccountDataBlockComponent,
    CustomActionLinksComponent,
    GovukListComponent,
    GovukListLinkComponent,
  ],
  templateUrl: './fines-acc-defendant-details-at-a-glance-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantDetailsAtAGlanceTabComponent {
  @Input() tabData!: IOpalFinesAccountDetailsAtAGlanceTabRefData | null;
  public handleLinkClick(): void {}
}
