import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type GovukBannerType = 'success' | 'warning' | 'information';
@Component({
  selector: 'app-moj-banner',
  standalone: true,
  imports: [],
  templateUrl: './moj-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojBannerComponent {
  @Input({required: true}) text!: string;
  @Input({required: true}) type: GovukBannerType = 'success';
}
