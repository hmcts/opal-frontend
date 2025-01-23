import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { AbstractFormArrayRemovalComponent } from '@components/abstract/abstract-form-array-removal-base/abstract-form-array-removal-base';
import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
import { GovukCancelLinkComponent } from '@components/govuk/govuk-cancel-link/govuk-cancel-link.component';
import { FinesMacOffenceDetailsService } from '../services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { IFinesMacOffenceDetailsMinorCreditorForm } from '../fines-mac-offence-details-minor-creditor/interfaces/fines-mac-offence-details-minor-creditor-form.interface';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../routing/constants/fines-mac-offence-details-routing-paths.constant';
import { FinesMacOffenceDetailsMinorCreditorInformationComponent } from '../fines-mac-offence-details-minor-creditor-information/fines-mac-offence-details-minor-creditor-information.component';

@Component({
  selector: 'app-fines-mac-offence-details-remove-minor-creditor',
  imports: [
    CommonModule,
    GovukButtonComponent,
    GovukCancelLinkComponent,
    FinesMacOffenceDetailsMinorCreditorInformationComponent,
  ],
  templateUrl: './fines-mac-offence-details-remove-minor-creditor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsRemoveMinorCreditorComponent
  extends AbstractFormArrayRemovalComponent
  implements OnInit
{
  protected readonly finesMacOffenceDetailsService = inject(FinesMacOffenceDetailsService);
  protected readonly fineMacOffenceDetailsRoutingPaths = FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS;

  public minorCreditor!: IFinesMacOffenceDetailsMinorCreditorForm;

  /**
   * Finds a minor creditor based on the imposition position.
   * @param impositionPosition - The imposition position to search for.
   * @returns The minor creditor form data matching the imposition position.
   */
  private findMinorCreditor(impositionPosition: number): IFinesMacOffenceDetailsMinorCreditorForm {
    const draftOffenceDetails =
      this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft[0];

    const minorCreditorsArray = draftOffenceDetails.childFormData!;
    return minorCreditorsArray.find(
      (childFormData) => childFormData.formData.fm_offence_details_imposition_position === impositionPosition,
    )!;
  }

  /**
   * Retrieves the minor creditor data and sets the corresponding properties.
   */
  private getMinorCreditorData(): void {
    const impositionPosition = this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.removeMinorCreditor;
    this.minorCreditor = this.findMinorCreditor(impositionPosition!);
  }

  /**
   * Finds the index of a minor creditor based on the imposition position.
   * @param impositionPosition The imposition position to search for.
   * @returns The index of the minor creditor, or -1 if not found.
   */
  private findMinorCreditorIndex(impositionPosition: number): number {
    const draftOffenceDetails =
      this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft[0];

    const minorCreditorsArray = draftOffenceDetails.childFormData!;
    return minorCreditorsArray.findIndex(
      (childFormData) => childFormData.formData.fm_offence_details_imposition_position === impositionPosition,
    );
  }

  /**
   * Confirms the removal of a minor creditor from the fines Mac offence details.
   * If the minor creditor exists in the list, it will be removed.
   * After removal, it will navigate to the add offence page.
   */
  public confirmMinorCreditorRemoval(): void {
    const impositionPosition = this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.removeMinorCreditor!;
    const index = this.findMinorCreditorIndex(impositionPosition);

    if (index !== -1) {
      this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft[0].childFormData!.splice(
        index,
        1,
      );
    }

    this.handleRoute(this.fineMacOffenceDetailsRoutingPaths.children.addOffence);
  }

  public ngOnInit(): void {
    this.getMinorCreditorData();
    this.finesMacOffenceDetailsService.offenceCodeMessage = '';
  }
}
