import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-govuk-task-list',
  standalone: true,
  imports: [],
  templateUrl: './govuk-task-list.component.html',
  styleUrl: './govuk-task-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukTaskListComponent {
  @Input({ required: true }) taskListId!: string;
  @Input({ required: false }) taskListClasses!: string;
}
