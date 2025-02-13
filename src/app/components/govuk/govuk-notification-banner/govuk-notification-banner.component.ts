import { Component, Input } from '@angular/core';

export type GovukBannerType = 'success' | 'information';
@Component({
  selector: 'app-govuk-notification-banner',
  imports: [],
  templateUrl: './govuk-notification-banner.component.html',
})
export class GovukNotificationBannerComponent {
  @Input({ required: true }) titleText!: string;
  @Input({ required: true }) headingText!: string;
  @Input({ required: true }) messageText!: string;
  @Input({ required: true }) type: GovukBannerType = 'success';
}
