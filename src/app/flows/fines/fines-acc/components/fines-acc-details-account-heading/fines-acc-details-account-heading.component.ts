import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CustomPageHeaderComponent } from '@hmcts/opal-frontend-common/components/custom/custom-page-header';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { GovukTagComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-tag';
import { GovukButtonDirective } from '@hmcts/opal-frontend-common/directives/govuk-button';
import { IOpalFinesDefendantAccountHeader } from '../../fines-acc-defendant-details/interfaces/fines-acc-defendant-account-header.interface';

@Component({
  selector: 'app-fines-acc-details-account-heading',
  imports: [
    CustomPageHeaderComponent,
    GovukTagComponent,
    GovukHeadingWithCaptionComponent,
    GovukButtonDirective,
    UpperCasePipe,
  ],
  templateUrl: './fines-acc-details-account-heading.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDetailsAccountHeadingComponent {
  @Input() accountData!: IOpalFinesDefendantAccountHeader;
  @Output() addAccountNote = new EventEmitter<void>();
}
