import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-moj-notification-badge',
  standalone: true,
  imports: [],
  templateUrl: './moj-notification-badge.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojNotificationBadgeComponent {
  @Input({ required: true }) badgeId!: string;
}
