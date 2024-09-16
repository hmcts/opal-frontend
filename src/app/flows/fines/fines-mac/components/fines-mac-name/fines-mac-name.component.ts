import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GovukTextInputComponent } from '@components/govuk/govuk-text-input/govuk-text-input.component';
import { IAbstractFormControlErrorMessage } from '@components/abstract/interfaces/abstract-form-control-error-message.interface';
import { IFinesMacNameFieldIds } from './interfaces';

@Component({
  selector: 'app-fines-mac-name',
  standalone: true,
  imports: [GovukTextInputComponent],
  templateUrl: './fines-mac-name.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacNameComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) formControlErrorMessages!: IAbstractFormControlErrorMessage;
  @Input({ required: true }) nameFieldIds!: IFinesMacNameFieldIds;
  @Input({ required: true }) componentName!: string;
}
