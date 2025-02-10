import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-govuk-checkboxes',
  imports: [CommonModule],
  templateUrl: './govuk-checkboxes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukCheckboxesComponent {
  @Input({ required: true }) fieldSetId!: string;

  @Input({ required: true }) legendText!: string;
  @Input({ required: false }) legendHint!: string;
  @Input({ required: false }) legendClasses!: string;
  @Input({ required: false }) checkboxClasses!: string;
}
