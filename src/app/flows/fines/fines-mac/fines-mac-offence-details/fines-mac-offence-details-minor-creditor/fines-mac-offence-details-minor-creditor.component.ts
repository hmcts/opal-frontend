import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FinesMacOffenceDetailsMinorCreditorFormComponent } from './fines-mac-offence-details-minor-creditor-form/fines-mac-offence-details-minor-creditor-form.component';
import { AbstractFormParentBaseComponent } from '@components/abstract/abstract-form-parent-base/abstract-form-parent-base.component';
import { FinesMacOffenceDetailsService } from '../services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { IFinesMacOffenceDetailsMinorCreditorForm } from './interfaces/fines-mac-offence-details-minor-creditor-form.interface';
import { FINES_MAC_STATUS } from '../../constants/fines-mac-status';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../routing/constants/fines-mac-offence-details-routing-paths.constant';
import { FinesService } from '@services/fines/fines-service/fines.service';

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

  public handleMinorCreditorFormSubmit(form: IFinesMacOffenceDetailsMinorCreditorForm): void {
    // Update the imposition position in the form data
    form.formData.fm_offence_details_imposition_position =
      this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.removeImposition!.rowIndex!;

    // Update the status as form is mandatory
    form.status = FINES_MAC_STATUS.PROVIDED;

    // Push data to state and update minor creditor added flag
    this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft[0].childFormData!.push(
      form,
    );
    //this.finesService.finesMacState.minorCreditors.push(form);
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
}
