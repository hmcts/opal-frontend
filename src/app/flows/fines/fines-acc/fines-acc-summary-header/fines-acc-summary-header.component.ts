import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FinesAccountStoreType } from '../types/fines-account-store.type';
import { FinesAccBannerMessagesComponent } from '../fines-acc-banner-messages/fines-acc-banner-messages.component';
import { CustomPageHeaderComponent } from '@hmcts/opal-frontend-common/components/custom/custom-page-header';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { GovukButtonDirective } from '@hmcts/opal-frontend-common/directives/govuk-button';
import { MojButtonMenuComponent } from '@hmcts/opal-frontend-common/components/moj/moj-button-menu';
import {
  MojAlertComponent,
  MojAlertContentComponent,
  MojAlertIconComponent,
  MojAlertTextComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-alert';
import { getFinesAccAccountStatusBannerLabel } from '../utils/fines-acc-account-status-banner.utils';

@Component({
  selector: 'app-fines-acc-summary-header',
  templateUrl: './fines-acc-summary-header.component.html',
  imports: [
    FinesAccBannerMessagesComponent,
    CustomPageHeaderComponent,
    GovukHeadingWithCaptionComponent,
    GovukButtonDirective,
    MojButtonMenuComponent,
    MojAlertComponent,
    MojAlertContentComponent,
    MojAlertIconComponent,
    MojAlertTextComponent,
  ],
})
export class FinesAccSummaryHeaderComponent {
  private _accountStatusCode: string | null = null;

  @Input({ required: true }) accountStore!: FinesAccountStoreType;
  @Input({ required: true }) showAddAccountNoteButton!: boolean;
  @Input() public set accountStatusCode(accountStatusCode: string | null | undefined) {
    this.accountStatusBannerLabel = getFinesAccAccountStatusBannerLabel(accountStatusCode);
    this._accountStatusCode = accountStatusCode ?? null;
  }

  public get accountStatusCode(): string | null {
    return this._accountStatusCode;
  }

  @Input() id = 'acc-summary-header';
  @Output() refreshPage = new EventEmitter<void>();
  @Output() navigateToAddAccountNotePage = new EventEmitter<void>();
  public accountStatusBannerLabel: string | null = null;

  /**
   * Emits the page refresh request to the parent account summary component.
   */
  public handleRefreshPage(): void {
    this.refreshPage.emit();
  }

  /**
   * Emits the request to navigate to the add account note page.
   */
  public handleNavigateToAddAccountNotePage(): void {
    this.navigateToAddAccountNotePage.emit();
  }
}
