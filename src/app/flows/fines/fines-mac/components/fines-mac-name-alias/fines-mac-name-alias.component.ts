import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
import { GovukCheckboxesComponent } from '@components/govuk/govuk-checkboxes/govuk-checkboxes.component';
import { GovukCheckboxesConditionalComponent } from '@components/govuk/govuk-checkboxes/govuk-checkboxes-conditional/govuk-checkboxes-conditional.component';
import { GovukCheckboxesItemComponent } from '@components/govuk/govuk-checkboxes/govuk-checkboxes-item/govuk-checkboxes-item.component';
import { GovukTextInputComponent } from '@components/govuk/govuk-text-input/govuk-text-input.component';
import { IAbstractFormAliasBaseAliasControls } from '@components/abstract/abstract-form-alias-base/interfaces/abstract-form-alias-base-alias-controls.interface';
import { IAbstractFormBaseFormControlErrorMessage } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-form-control-error-message.interface';
import { IFinesMacNameAliasOutput } from './interfaces';

@Component({
  selector: 'app-fines-mac-name-alias',
  standalone: true,
  imports: [
    GovukTextInputComponent,
    GovukButtonComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesConditionalComponent,
    GovukCheckboxesItemComponent,
  ],
  templateUrl: './fines-mac-name-alias.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacNameAliasComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) aliasControls!: IAbstractFormAliasBaseAliasControls[];
  @Input({ required: true }) formControlErrorMessages!: IAbstractFormBaseFormControlErrorMessage;
  @Input({ required: true }) componentName!: string;
  @Output() addAlias = new EventEmitter<IFinesMacNameAliasOutput>();
  @Output() removeAlias = new EventEmitter<IFinesMacNameAliasOutput>();

  public emitAction(aliasControlLength: number, aliasFieldName: string, isRemoving: boolean = false): void {
    const aliasOutput = { aliasControlLength, aliasFieldName } as IFinesMacNameAliasOutput;

    (isRemoving ? this.removeAlias : this.addAlias).emit(aliasOutput);
  }
}
