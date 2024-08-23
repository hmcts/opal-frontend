import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  GovukButtonComponent,
  GovukCheckboxesComponent,
  GovukCheckboxesConditionalComponent,
  GovukCheckboxesItemComponent,
  GovukTextInputComponent,
} from '@components/govuk';
import {
  IAbstractFormAliasBaseAliasControls,
  IAbstractFormBaseFormControlErrorMessage,
} from '@interfaces/components/abstract';
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
