import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FinesMacOffenceDetailsMinorCreditorFormComponent } from './fines-mac-offence-details-minor-creditor-form/fines-mac-offence-details-minor-creditor-form.component';
import { AbstractFormParentBaseComponent } from '@components/abstract/abstract-form-parent-base/abstract-form-parent-base.component';
import { FinesMacOffenceDetailsService } from '../services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { IFinesMacOffenceDetailsMinorCreditorForm } from './interfaces/fines-mac-offence-details-minor-creditor-form.interface';
import { FINES_MAC_STATUS } from '../../constants/fines-mac-status';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../routing/constants/fines-mac-offence-details-routing-paths.constant';
import { FinesService } from '@services/fines/fines-service/fines.service';

@Component({
  selector: 'app-fines-mac-offence-details-minor-creditor',

  imports: [FinesMacOffenceDetailsMinorCreditorFormComponent],
  templateUrl: './fines-mac-offence-details-minor-creditor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsMinorCreditorComponent
  extends AbstractFormParentBaseComponent
  implements OnInit, OnDestroy
{
  protected readonly finesMacOffenceDetailsService = inject(FinesMacOffenceDetailsService);
  protected readonly finesService = inject(FinesService);

  /**
   * Handles the submission of the minor creditor form.
   *
   * @param {IFinesMacOffenceDetailsMinorCreditorForm} form - The form data for the minor creditor.
   *
   * Updates the imposition position in the form data, sets the form status as provided,
   * pushes the form data to the offence details draft state, sets the minor creditor added flag,
   * and navigates to the add offence route.
   */
  public handleMinorCreditorFormSubmit(form: IFinesMacOffenceDetailsMinorCreditorForm): void {
    // Update the imposition position in the form data
    const { removeImposition, removeMinorCreditor } =
      this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState;
    form.formData.fm_offence_details_imposition_position = removeMinorCreditor ?? removeImposition!.rowIndex;

    // Update the status as form is mandatory
    form.status = FINES_MAC_STATUS.PROVIDED;

    // If childFormData exists and has at least one item in
    const { childFormData } =
      this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft[0];

    if (childFormData && childFormData.length > 0) {
      const minorCreditor = childFormData.find(
        (childFormData) => childFormData.formData.fm_offence_details_imposition_position === removeMinorCreditor,
      );
      if (minorCreditor) {
        minorCreditor.formData = form.formData;
      } else {
        childFormData.push(form);
      }
    } else {
      childFormData!.push(form);
    }

    this.finesMacOffenceDetailsService.minorCreditorAdded = true;

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

  public ngOnInit(): void {
    this.finesMacOffenceDetailsService.offenceCodeMessage = '';
  }

  public ngOnDestroy(): void {
    this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.removeMinorCreditor = null;
  }
}
