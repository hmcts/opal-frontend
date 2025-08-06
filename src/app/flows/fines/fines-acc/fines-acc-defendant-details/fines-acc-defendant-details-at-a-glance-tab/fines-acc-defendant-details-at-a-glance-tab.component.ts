import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FinesAccDetailsAccountDataBlockComponent } from '../../components/fines-acc-details-account-data-block/fines-acc-details-account-data-block.component';
import { CustomActionLinksComponent } from '@hmcts/opal-frontend-common/components/custom/custom-action-links';
import { GovukListComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-list';
import { GovukListLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-list/govuk-list-link';

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
  public handleLinkClick(): void {}
}
