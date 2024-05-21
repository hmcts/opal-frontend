import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-govuk-radio-new',
  standalone: true,
  imports: [],
  templateUrl: './govuk-radio-new.component.html',
  styleUrl: './govuk-radio-new.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukRadioNewComponent {
  @Input({ required: true }) fieldSetId!: string;

  @Input({ required: true }) legendText!: string;
  @Input({ required: false }) legendHint!: string;
  @Input({ required: false }) legendClasses!: string;
  @Input({ required: false }) radioClasses!: string;
}
