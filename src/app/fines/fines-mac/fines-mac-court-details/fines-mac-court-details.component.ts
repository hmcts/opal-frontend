import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormParentBaseComponent } from '@components/abstract';
import { OpalFines } from '../../services/opal-fines.service';
import { IAutoCompleteItem, IGovUkSelectOptions } from '@interfaces';
import { Observable, forkJoin, map } from 'rxjs';
import { IFinesCourtRefData, IFinesLocalJusticeAreaRefData } from '../../interfaces';
import { IFinesMacCourtDetailsForm } from '../interfaces';
import { FINES_MAC_NESTED_ROUTES } from '../constants/fines-mac-nested-routes';
import { FinesMacRoutes } from '../enums';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FinesMacCourtDetailsFormComponent } from './fines-mac-court-details-form/fines-mac-court-details-form.component';

@Component({
  selector: 'app-fines-mac-court-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FinesMacCourtDetailsFormComponent],
  templateUrl: './fines-mac-court-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacCourtDetailsComponent extends FormParentBaseComponent {
  private opalFinesService = inject(OpalFines);
  private sendingCourtData$: Observable<IGovUkSelectOptions[]> = this.opalFinesService.getLocalJusticeAreas().pipe(
    map((response: IFinesLocalJusticeAreaRefData) => {
      return this.createAutoCompleteItemsLja(response);
    }),
  );
  private enforcementCourtData$: Observable<IGovUkSelectOptions[]> = this.opalFinesService
    .getCourts(this.finesService.finesMacState.businessUnit.businessUnitId)
    .pipe(
      map((response: IFinesCourtRefData) => {
        return this.createAutoCompleteItemsCourts(response);
      }),
    );
  protected groupLjaAndCourtData$ = forkJoin({
    sendingCourtData: this.sendingCourtData$,
    enforcementCourtData: this.enforcementCourtData$,
  });

  public defendantType = this.finesService.finesMacState.accountDetails.DefendantType!;

  /**
   * Creates an array of autocomplete items based on the response from the server.
   * @param response - The response object containing the local justice area reference data.
   * @returns An array of autocomplete items.
   */
  private createAutoCompleteItemsLja(response: IFinesLocalJusticeAreaRefData): IAutoCompleteItem[] {
    const localJusticeAreas = response.refData;

    return localJusticeAreas.map((item) => {
      return {
        value: `${item.name} (${item.ljaCode})`,
        name: `${item.name} (${item.ljaCode})`,
      };
    });
  }

  /**
   * Creates an array of autocomplete items based on the response from the server.
   * @param response - The response object containing the local justice area reference data.
   * @returns An array of autocomplete items.
   */
  private createAutoCompleteItemsCourts(response: IFinesCourtRefData): IAutoCompleteItem[] {
    const courts = response.refData;

    return courts.map((item) => {
      return {
        value: `${item.name} (${item.courtCode})`,
        name: `${item.name} (${item.courtCode})`,
      };
    });
  }

  /**
   * Handles the form submission for court details.
   * @param formData - The form data containing the search parameters.
   */
  public handleCourtDetailsSubmit(form: IFinesMacCourtDetailsForm): void {
    this.finesService.finesMacState = {
      ...this.finesService.finesMacState,
      courtDetails: form.formData,
      unsavedChanges: false,
      stateChanges: true,
    };

    if (form.nestedFlow && this.defendantType) {
      const nextRoute = FINES_MAC_NESTED_ROUTES[this.defendantType]['courtDetails'];
      if (nextRoute) {
        this.routerNavigate(nextRoute.nextRoute);
      }
    } else {
      this.routerNavigate(FinesMacRoutes.finesMacAccountDetails);
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
