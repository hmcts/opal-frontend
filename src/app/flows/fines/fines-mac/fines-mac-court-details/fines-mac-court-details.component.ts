import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { Observable, forkJoin, map, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FinesMacCourtDetailsFormComponent } from './fines-mac-court-details-form/fines-mac-court-details-form.component';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesCourtRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-court-ref-data.interface';
import { IOpalFinesLocalJusticeAreaRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-local-justice-area-ref-data.interface';
import { IFinesMacCourtDetailsForm } from './interfaces/fines-mac-court-details-form.interface';
import { IGovUkSelectOptions } from '@hmcts/opal-frontend-common/components/govuk/govuk-select/interfaces';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../routing/constants/fines-mac-routing-nested-routes.constant';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths.constant';
import { FinesMacStore } from '../stores/fines-mac.store';

@Component({
  selector: 'app-fines-mac-court-details',
  imports: [CommonModule, RouterModule, FinesMacCourtDetailsFormComponent],
  templateUrl: './fines-mac-court-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacCourtDetailsComponent extends AbstractFormParentBaseComponent {
  private readonly opalFinesService = inject(OpalFines);
  private readonly finesMacStore = inject(FinesMacStore);
  public localJusticeAreas!: IOpalFinesLocalJusticeAreaRefData;
  private readonly sendingCourtData$: Observable<IGovUkSelectOptions[]> = this.opalFinesService
    .getLocalJusticeAreas()
    .pipe(
      tap((response: IOpalFinesLocalJusticeAreaRefData) => {
        this.localJusticeAreas = response;
      }),
      map((response: IOpalFinesLocalJusticeAreaRefData) => {
        return this.createAutoCompleteItemsLja(response);
      }),
    );
  private readonly enforcementCourtData$: Observable<IGovUkSelectOptions[]> = this.opalFinesService
    .getCourts(this.finesMacStore.getBusinessUnitId())
    .pipe(
      map((response: IOpalFinesCourtRefData) => {
        return this.createAutoCompleteItemsCourts(response);
      }),
    );
  protected groupLjaAndCourtData$ = forkJoin({
    sendingCourtData: this.sendingCourtData$,
    enforcementCourtData: this.enforcementCourtData$,
  });

  public defendantType = this.finesMacStore.getDefendantType();

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
    this.finesMacStore.setCourtDetails(form);

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
    this.finesMacStore.setUnsavedChanges(unsavedChanges);
    this.stateUnsavedChanges = unsavedChanges;
  }
}
