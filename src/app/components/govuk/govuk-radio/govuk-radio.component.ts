import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-govuk-radio',
  imports: [],
  templateUrl: './govuk-radio.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukRadioComponent {
  @Input({ required: true }) fieldSetId!: string;

  @Input({ required: false }) legendText!: string;
  @Input({ required: false }) legendHint!: string;
  @Input({ required: false }) legendClasses!: string;
  @Input({ required: false }) radioClasses!: string;
  @Input({ required: false }) errors!: string | null;
}
