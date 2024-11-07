import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-moj-badge',
  standalone: true,
  imports: [],
  templateUrl: './moj-badge.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojBadgeComponent {
  @Input({ required: true }) badgeId!: string;
  @Input({ required: false }) badgeClasses!: string;
}
