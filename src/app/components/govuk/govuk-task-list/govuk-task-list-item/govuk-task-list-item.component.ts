import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-govuk-task-list-item',
  standalone: true,
  imports: [],
  templateUrl: './govuk-task-list-item.component.html',
  styleUrl: './govuk-task-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukTaskListItemComponent {
  @Input({ required: true }) taskListItemId!: string;
  @Input({ required: true }) taskListStatusId!: string;
  @Input({ required: false }) taskListItemClasses!: string;
}
