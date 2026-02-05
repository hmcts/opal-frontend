import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FinesAccountStoreType } from '../types/fines-account-store.type';
import { FinesAccBannerMessagesComponent } from '../fines-acc-banner-messages/fines-acc-banner-messages-component';
import { CustomPageHeaderComponent } from '@hmcts/opal-frontend-common/components/custom/custom-page-header';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { GovukButtonDirective } from '@hmcts/opal-frontend-common/directives/govuk-button';
import { MojButtonMenuComponent } from '@hmcts/opal-frontend-common/components/moj/moj-button-menu';

@Component({
  selector: 'app-fines-acc-summary-header',
  templateUrl: './fines-acc-summary-header.component.html',
  imports: [
    FinesAccBannerMessagesComponent,
    CustomPageHeaderComponent,
    GovukHeadingWithCaptionComponent,
    GovukButtonDirective,
    MojButtonMenuComponent,
  ],
})
export class FinesAccSummaryHeaderComponent {
  @Input({ required: true }) accountStore!: FinesAccountStoreType;
  @Input({ required: true }) hasAddAccountActivityNotePermission!: boolean;
  @Output() refreshPage = new EventEmitter<void>();
  @Output() navigateToAddAccountNotePage = new EventEmitter<void>();

  public handleRefreshPage(): void {
    this.refreshPage.emit();
  }

  public handleNavigateToAddAccountNotePage(): void {
    this.navigateToAddAccountNotePage.emit();
  }
}
