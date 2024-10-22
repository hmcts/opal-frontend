import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FinesMacOffenceDetailsMinorCreditorFormComponent } from './fines-mac-offence-details-minor-creditor-form/fines-mac-offence-details-minor-creditor-form.component';
import { AbstractFormParentBaseComponent } from '@components/abstract/abstract-form-parent-base/abstract-form-parent-base.component';
import { FinesMacOffenceDetailsService } from '../services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { IFinesMacOffenceDetailsMinorCreditorForm } from './interfaces/fines-mac-offence-details-minor-creditor-form.interface';
import { FINES_MAC_STATUS } from '../../constants/fines-mac-status';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../routing/constants/fines-mac-offence-details-routing-paths.constant';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FormArray } from '@angular/forms';
import { FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FIELD_NAMES } from '../constants/fines-mac-offence-details-minor-creditor-field-names.constant';

@Component({
  selector: 'app-fines-mac-offence-details-minor-creditor',
  standalone: true,
  imports: [FinesMacOffenceDetailsMinorCreditorFormComponent],
  templateUrl: './fines-mac-offence-details-minor-creditor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsMinorCreditorComponent extends AbstractFormParentBaseComponent {
  protected readonly finesMacOffenceDetailsService = inject(FinesMacOffenceDetailsService);
  protected readonly finesService = inject(FinesService);

  /**
   * Patch the form values of a specific row in a FormArray with the provided data.
   * @param formArray - The FormArray to patch the values in.
   * @param rowIndex - The index of the row to patch the values for.
   * @param formData - The data to patch the values with.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private patchFormValues(formArray: FormArray, rowIndex: number, formData: any): void {
    const fields = FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FIELD_NAMES.fieldNames;
    const dynamicFieldPrefix = FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FIELD_NAMES.dynamicFieldPrefix;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const patchData: { [key: string]: any } = fields.reduce(
      (acc, field) => {
        acc[`${dynamicFieldPrefix}_${field}_${rowIndex}`] = formData[`${dynamicFieldPrefix}_${field}`];
        return acc;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {} as { [key: string]: any },
    );

    formArray.controls[rowIndex]?.get(`${dynamicFieldPrefix}_${rowIndex}`)?.patchValue(patchData);
  }

  /**
   * Handles the form submission for the minor creditor in the fines MAC offence details component.
   * Updates the form status, patches the form values, and updates the state with the form data.
   * Navigates to the add offence route after form submission.
   *
   * @param form - The form data for the minor creditor.
   */
  public handleMinorCreditorFormSubmit(form: IFinesMacOffenceDetailsMinorCreditorForm): void {
    // Update the status as form is mandatory
    form.status = FINES_MAC_STATUS.PROVIDED;

    const { removeImposition, offenceDetailsDraft } =
      this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState;

    const { formData } = form;

    this.patchFormValues(removeImposition!.formArray, removeImposition!.rowIndex, formData);

    // Update the state with the form data
    offenceDetailsDraft[0].formData.fm_offence_details_impositions = removeImposition?.formArray.value;

    this.routerNavigate(FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addOffence);
  }

  /**
   * Handles unsaved changes coming from the child component
   *
   * @param unsavedChanges boolean value from child component
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.finesService.finesMacState.unsavedChanges = unsavedChanges;
    this.stateUnsavedChanges = unsavedChanges;
  }
}
