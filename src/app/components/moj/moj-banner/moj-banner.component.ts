import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type MojBannerType = 'success' | 'warning' | 'information';
@Component({
  selector: 'app-moj-banner',
  templateUrl: './moj-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojBannerComponent {
  @Input({ required: true }) text!: string;
  @Input({ required: true }) type: MojBannerType = 'success';
}
