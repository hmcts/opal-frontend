import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IFinesMacVehicleDetailsFieldIds } from './interfaces';
import { FormGroup } from '@angular/forms';
import { IAbstractFormControlErrorMessage } from '@components/abstract/interfaces/abstract-form-control-error-message.interface';
import { GovukTextInputComponent } from '@components/govuk/govuk-text-input/govuk-text-input.component';

@Component({
  selector: 'app-fines-mac-vehicle-details',
  standalone: true,
  imports: [GovukTextInputComponent],
  templateUrl: './fines-mac-vehicle-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacVehicleDetailsComponent {
  @Input({ required: false }) divider!: boolean;
  @Input({ required: true }) legendText!: string;
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) formControlErrorMessages!: IAbstractFormControlErrorMessage;
  @Input({ required: true }) vehicleDetailsFieldIds!: IFinesMacVehicleDetailsFieldIds;
  @Input({ required: true }) componentName!: string;
}
