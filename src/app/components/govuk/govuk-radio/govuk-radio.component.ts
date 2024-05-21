import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-govuk-radio',
  standalone: true,
  imports: [],
  templateUrl: './govuk-radio.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukRadioComponent {
  @Input({ required: true }) fieldSetId!: string;

  @Input({ required: true }) legendText!: string;
  @Input({ required: false }) legendHint!: string;
  @Input({ required: false }) legendClasses!: string;
  @Input({ required: false }) radioClasses!: string;
}
