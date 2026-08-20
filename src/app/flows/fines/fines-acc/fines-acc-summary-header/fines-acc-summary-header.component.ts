import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FinesAccountStoreType } from '../types/fines-account-store.type';
import { FinesAccBannerMessagesComponent } from '../fines-acc-banner-messages/fines-acc-banner-messages.component';
import { getFinesAccAccountStatusBannerContent } from '../utils/fines-acc-account-status-banner.utils';
import { type FinesAccountStatusBanner } from '../interfaces/fines-account-status-banner.interface';
import { CustomPageHeaderComponent } from '@hmcts/opal-frontend-common/components/custom/custom-page-header';
import { GovukButtonDirective } from '@hmcts/opal-frontend-common/directives/govuk-button';
import { MojButtonMenuComponent } from '@hmcts/opal-frontend-common/components/moj/moj-button-menu';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import {
  MojAlertComponent,
  MojAlertContentComponent,
  MojAlertIconComponent,
  MojAlertTextComponent,
  MojAlertHeadingComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-alert';

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
    MojAlertHeadingComponent,
  ],
})
export class FinesAccSummaryHeaderComponent {
  private _accountStatusCode: string | null = null;

  @Input({ required: true }) accountStore!: FinesAccountStoreType;
  @Input({ required: true }) showAddAccountNoteButton!: boolean;
  @Input() public set accountStatusCode(accountStatusCode: string | null | undefined) {
    this.accountStatusBannerContent = getFinesAccAccountStatusBannerContent(accountStatusCode);
    this._accountStatusCode = accountStatusCode ?? null;
  }

  /**
   * Gets the account status code for the fines account.
   */
  public get accountStatusCode(): string | null {
    return this._accountStatusCode;
  }

  @Input() id = 'acc-summary-header';
  @Output() refreshPage = new EventEmitter<void>();
  @Output() navigateToAddAccountNotePage = new EventEmitter<void>();
  public accountStatusBannerContent: FinesAccountStatusBanner | null = null;

  /**
   * Gets the account status banner aria label for the fines account.
   */
  public get accountStatusBannerAriaLabel(): string {
    return [this.accountStatusBannerContent?.heading, this.accountStatusBannerContent?.label]
      .filter(Boolean)
      .join(', ');
  }

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
