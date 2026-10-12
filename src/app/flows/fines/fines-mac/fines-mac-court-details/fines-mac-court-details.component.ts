import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';

import { RouterModule } from '@angular/router';
import { FINES_MAC_NESTED_ROUTE_KEYS } from '../constants/fines-mac-nested-route-keys.constant';
import { FinesMacCourtDetailsFormComponent } from './fines-mac-court-details-form/fines-mac-court-details-form.component';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesCourtRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-court-ref-data.interface';
import { IFinesMacCourtDetailsForm } from './interfaces/fines-mac-court-details-form.interface';
import { FinesMacFormParentBaseComponent } from '../components/abstract/fines-mac-form-parent-base/fines-mac-form-parent-base.component';
import { IFinesMacOriginatorRefData } from '../routing/resolvers/fetch-originators-resolver/interfaces/fines-mac-originator-ref-data.interface';

@Component({
  selector: 'app-fines-mac-court-details',
  imports: [RouterModule, FinesMacCourtDetailsFormComponent],
  templateUrl: './fines-mac-court-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacCourtDetailsComponent extends FinesMacFormParentBaseComponent implements OnInit {
  private readonly opalFinesService = inject(OpalFines);
  private courts!: IOpalFinesCourtRefData;

  protected originators!: IFinesMacOriginatorRefData;

  public sendingCourtData: IAlphagovAccessibleAutocompleteItem[] = [];
  public enforcementCourtData: IAlphagovAccessibleAutocompleteItem[] = [];

  /**
   * Creates autocomplete items from the normalized originator reference data.
   * Conditional Caution originators are prosecutors; Fine originators are local justice areas.
   * @param response - The normalized originator reference data resolved for the current account type.
   * @returns Autocomplete items containing each originator's ID and display name.
   */
  private createAutoCompleteItemsOriginators(
    response: IFinesMacOriginatorRefData,
  ): IAlphagovAccessibleAutocompleteItem[] {
    return response.refData.map((originator) => {
      return {
        value: originator.originatorId,
        name: originator.displayName,
      };
    });
  }

  /**
   * Creates an array of autocomplete items based on the response from the server.
   * @param response - The response object containing the enforcement court reference data.
   * @returns An array of autocomplete items.
   */
  private createAutoCompleteItemsCourts(response: IOpalFinesCourtRefData): IAlphagovAccessibleAutocompleteItem[] {
    const courts = response.refData;

    return courts.map((item) => {
      return {
        value: item.court_id,
        name: this.opalFinesService.getCourtPrettyName(item),
      };
    });
  }

  /**
   * Handles the form submission for court details.
   * @param form - The completed court details form data.
   */
  public handleCourtDetailsSubmit(form: IFinesMacCourtDetailsForm): void {
    this.finesMacStore.setCourtDetails(form);

    if (form.nestedFlow) {
      this.handleNestedFlowNavigation(FINES_MAC_NESTED_ROUTE_KEYS.courtDetails);
      return;
    }

    this.navigateToAccountDetails();
  }

  public ngOnInit(): void {
    this.originators = this['activatedRoute'].snapshot.data['originators'];
    this.courts = this['activatedRoute'].snapshot.data['courts'];

    this.sendingCourtData = this.createAutoCompleteItemsOriginators(this.originators);
    this.enforcementCourtData = this.createAutoCompleteItemsCourts(this.courts);
  }
}
