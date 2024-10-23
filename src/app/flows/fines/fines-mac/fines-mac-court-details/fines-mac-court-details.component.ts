import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractFormParentBaseComponent } from '@components/abstract/abstract-form-parent-base/abstract-form-parent-base.component';
import { IAlphagovAccessibleAutocompleteItem } from '@components/alphagov/alphagov-accessible-autocomplete/interfaces/alphagov-accessible-autocomplete-item.interface';
import { Observable, forkJoin, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FinesMacCourtDetailsFormComponent } from './fines-mac-court-details-form/fines-mac-court-details-form.component';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';

import { IOpalFinesCourtRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-court-ref-data.interface';
import { IOpalFinesLocalJusticeAreaRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-local-justice-area-ref-data.interface';
import { IFinesMacCourtDetailsForm } from './interfaces/fines-mac-court-details-form.interface';
import { IGovUkSelectOptions } from '@components/govuk/govuk-select/interfaces/govuk-select-options.interface';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../routing/constants/fines-mac-routing-nested-routes';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths';
import { FINES_MAC_STATUS } from '../constants/fines-mac-status';

@Component({
  selector: 'app-fines-mac-court-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FinesMacCourtDetailsFormComponent],
  templateUrl: './fines-mac-court-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacCourtDetailsComponent extends AbstractFormParentBaseComponent {
  private readonly opalFinesService = inject(OpalFines);
  protected readonly finesService = inject(FinesService);
  private readonly sendingCourtData$: Observable<IGovUkSelectOptions[]> = this.opalFinesService
    .getLocalJusticeAreas()
    .pipe(
      map((response: IOpalFinesLocalJusticeAreaRefData) => {
        return this.createAutoCompleteItemsLja(response);
      }),
    );
  private readonly enforcementCourtData$: Observable<IGovUkSelectOptions[]> = this.opalFinesService
    .getCourts(this.finesService.finesMacState.businessUnit.business_unit_id)
    .pipe(
      map((response: IOpalFinesCourtRefData) => {
        return this.createAutoCompleteItemsCourts(response);
      }),
    );
  protected groupLjaAndCourtData$ = forkJoin({
    sendingCourtData: this.sendingCourtData$,
    enforcementCourtData: this.enforcementCourtData$,
  });

  public defendantType = this.finesService.finesMacState.accountDetails.formData.fm_create_account_defendant_type!;

  /**
   * Creates an array of autocomplete items based on the response from the server.
   * @param response - The response object containing the local justice area reference data.
   * @returns An array of autocomplete items.
   */
  private createAutoCompleteItemsLja(
    response: IOpalFinesLocalJusticeAreaRefData,
  ): IAlphagovAccessibleAutocompleteItem[] {
    const localJusticeAreas = response.refData;

    return localJusticeAreas.map((item) => {
      return {
        value: item.local_justice_area_id,
        name: this.opalFinesService.getLocalJusticeAreaPrettyName(item),
      };
    });
  }

  /**
   * Creates an array of autocomplete items based on the response from the server.
   * @param response - The response object containing the local justice area reference data.
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
   * @param formData - The form data containing the search parameters.
   */
  public handleCourtDetailsSubmit(form: IFinesMacCourtDetailsForm): void {
    // Update the status as form is mandatory
    form.status = FINES_MAC_STATUS.PROVIDED;

    // Update the state with the form data
    this.finesService.finesMacState = {
      ...this.finesService.finesMacState,
      courtDetails: form,
      unsavedChanges: false,
      stateChanges: true,
    };

    if (form.nestedFlow && this.defendantType) {
      const nextRoute = FINES_MAC_ROUTING_NESTED_ROUTES[this.defendantType]['courtDetails'];
      if (nextRoute) {
        this.routerNavigate(nextRoute.nextRoute);
      }
    } else {
      this.routerNavigate(FINES_MAC_ROUTING_PATHS.children.accountDetails);
    }
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
