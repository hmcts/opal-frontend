import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-govuk-checkboxes-new',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './govuk-checkboxes-new.component.html',
  styleUrl: './govuk-checkboxes-new.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukCheckboxesNewComponent {
  @Input({ required: true }) fieldSetId!: string;

  @Input({ required: true }) legendText!: string;
  @Input({ required: false }) legendHint!: string;
  @Input({ required: false }) legendClasses!: string;
  @Input({ required: false }) checkboxClasses!: string;
}
