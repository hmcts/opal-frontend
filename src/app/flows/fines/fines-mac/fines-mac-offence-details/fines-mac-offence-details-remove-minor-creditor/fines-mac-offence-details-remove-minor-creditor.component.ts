import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { AbstractFormArrayRemovalComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-array-removal-base';
import { IFinesMacOffenceDetailsMinorCreditorForm } from '../fines-mac-offence-details-minor-creditor/interfaces/fines-mac-offence-details-minor-creditor-form.interface';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../routing/constants/fines-mac-offence-details-routing-paths.constant';
import { FinesMacOffenceDetailsMinorCreditorInformationComponent } from '../fines-mac-offence-details-minor-creditor-information/fines-mac-offence-details-minor-creditor-information.component';
import { FinesMacOffenceDetailsStore } from '../stores/fines-mac-offence-details.store';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';

@Component({
  selector: 'app-fines-mac-offence-details-remove-minor-creditor',
  imports: [GovukButtonComponent, GovukCancelLinkComponent, FinesMacOffenceDetailsMinorCreditorInformationComponent],
  templateUrl: './fines-mac-offence-details-remove-minor-creditor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsRemoveMinorCreditorComponent
  extends AbstractFormArrayRemovalComponent
  implements OnInit
{
  private readonly finesMacOffenceDetailsStore = inject(FinesMacOffenceDetailsStore);
  protected readonly fineMacOffenceDetailsRoutingPaths = FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS;
  public minorCreditor!: IFinesMacOffenceDetailsMinorCreditorForm;

  /**
   * Finds a minor creditor based on the imposition position.
   * @param impositionPosition - The imposition position to search for.
   * @returns The minor creditor form data matching the imposition position.
   */
  private findMinorCreditor(impositionPosition: number): IFinesMacOffenceDetailsMinorCreditorForm {
    const draftOffenceDetails = this.finesMacOffenceDetailsStore.offenceDetailsDraft()[0];

    const minorCreditorsArray = draftOffenceDetails.childFormData!;
    return minorCreditorsArray.find(
      (childFormData) => childFormData.formData.fm_offence_details_imposition_position === impositionPosition,
    )!;
  }

  /**
   * Retrieves the minor creditor data and sets the corresponding properties.
   */
  private getMinorCreditorData(): void {
    const impositionPosition = this.finesMacOffenceDetailsStore.removeMinorCreditor();
    this.minorCreditor = this.findMinorCreditor(impositionPosition!);
  }

  /**
   * Finds the index of a minor creditor based on the imposition position.
   * @param impositionPosition The imposition position to search for.
   * @returns The index of the minor creditor, or -1 if not found.
   */
  private findMinorCreditorIndex(impositionPosition: number): number {
    const draftOffenceDetails = this.finesMacOffenceDetailsStore.offenceDetailsDraft()[0];

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
    const impositionPosition = this.finesMacOffenceDetailsStore.removeMinorCreditor()!;
    const index = this.findMinorCreditorIndex(impositionPosition);
    const offenceDetailsDraft = structuredClone(this.finesMacOffenceDetailsStore.offenceDetailsDraft()[0]);

    if (index !== -1) {
      offenceDetailsDraft.childFormData!.splice(index, 1);
      this.finesMacOffenceDetailsStore.setOffenceDetailsDraft([offenceDetailsDraft]);
    }

    this.handleRoute(this.fineMacOffenceDetailsRoutingPaths.children.addOffence);
  }

  public ngOnInit(): void {
    this.getMinorCreditorData();
    this.finesMacOffenceDetailsStore.resetOffenceCodeMessage();
  }
}
