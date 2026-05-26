import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IFinesAccMinorCreditorAddAmendConvertForm } from '../interfaces/fines-acc-minor-creditor-add-amend-convert-form.interface';
import { FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_FORM } from '../constants/fines-acc-minor-creditor-add-amend-convert-form.constant';

@Component({
  selector: 'app-fines-acc-minor-creditor-add-amend-convert-form',
  templateUrl: './fines-acc-minor-creditor-add-amend-convert-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccMinorCreditorAddAmendConvertFormComponent {
  @Input({ required: false }) public initialFormData: IFinesAccMinorCreditorAddAmendConvertForm =
    FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_FORM;
  @Output() public formSubmit = new EventEmitter<IFinesAccMinorCreditorAddAmendConvertForm>();
  @Output() public unsavedChanges = new EventEmitter<boolean>();
}
