import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  MojAlertComponent,
  MojAlertContentComponent,
  MojAlertIconComponent,
  MojAlertTextComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-alert';

@Component({
  selector: 'app-fines-acc-banner-messages',
  templateUrl: './fines-acc-banner-messages-component.html',
  imports: [MojAlertComponent, MojAlertContentComponent, MojAlertTextComponent, MojAlertIconComponent],
})
export class FinesAccBannerMessagesComponent {
  @Input({ required: true }) hasVersionMismatch!: boolean;
  @Input({ required: true }) successMessage: string | null = null;
  @Output() clearSuccessMessage = new EventEmitter<void>();
  @Output() refreshPage = new EventEmitter<void>();

  public handleClearSuccessMessage(): void {
    this.clearSuccessMessage.emit();
  }

  public handleRefreshPage(): void {
    this.refreshPage.emit();
  }
}
