import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CourtDetailsFormComponent } from './court-details-form/court-details-form.component';
import { FormParentBaseComponent } from '@components';
import { ManualAccountCreationRoutes } from '@enums';
import {
  IAutoCompleteItem,
  ICourtRefData,
  IGovUkSelectOptions,
  ILocalJusticeAreaRefData,
  IManualAccountCreationCourtDetailsForm,
} from '@interfaces';
import { CourtService, LocalJusticeAreaService } from '@services';
import { Observable, forkJoin, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MANUAL_ACCOUNT_CREATION_NESTED_ROUTES } from '../constants/manual-account-creation-nested-routes';

@Component({
  selector: 'app-court-details',
  standalone: true,
  imports: [CommonModule, RouterModule, CourtDetailsFormComponent],
  templateUrl: './court-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourtDetailsComponent extends FormParentBaseComponent {
  private localJusticeAreaService = inject(LocalJusticeAreaService);
  private courtService = inject(CourtService);
  public sendingCourtData$: Observable<IGovUkSelectOptions[]> = this.localJusticeAreaService
    .getLocalJusticeAreas()
    .pipe(
      map((response: ILocalJusticeAreaRefData) => {
        return this.createAutoCompleteItemsLja(response);
      }),
    );
  public enforcementCourtData$: Observable<IGovUkSelectOptions[]> = this.courtService
    .getCourts(this.macStateService.manualAccountCreation.businessUnit.businessUnitId)
    .pipe(
      map((response: ICourtRefData) => {
        return this.createAutoCompleteItemsCourts(response);
      }),
    );
  public groupLjaAndCourtData$ = forkJoin({
    sendingCourtData: this.sendingCourtData$,
    enforcementCourtData: this.enforcementCourtData$,
  });

  public defendantType = this.macStateService.manualAccountCreation.accountDetails.defendantType!;

  /**
   * Creates an array of autocomplete items based on the response from the server.
   * @param response - The response object containing the local justice area reference data.
   * @returns An array of autocomplete items.
   */
  private createAutoCompleteItemsLja(response: ILocalJusticeAreaRefData): IAutoCompleteItem[] {
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
  private createAutoCompleteItemsCourts(response: ICourtRefData): IAutoCompleteItem[] {
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
  public handleCourtDetailsSubmit(courtDetailsForm: IManualAccountCreationCourtDetailsForm): void {
    this.macStateService.manualAccountCreation = {
      ...this.macStateService.manualAccountCreation,
      courtDetails: courtDetailsForm.formData,
      unsavedChanges: false,
      stateChanges: true,
    };

    if (courtDetailsForm.nestedFlow && this.defendantType) {
      const nextRoute = MANUAL_ACCOUNT_CREATION_NESTED_ROUTES[this.defendantType]['courtDetails'];
      if (nextRoute) {
        this.routerNavigate(nextRoute.nextRoute);
      }
    } else {
      this.routerNavigate(ManualAccountCreationRoutes.accountDetails);
    }
  }

  /**
   * Handles unsaved changes coming from the child component
   *
   * @param unsavedChanges boolean value from child component
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.macStateService.manualAccountCreation.unsavedChanges = unsavedChanges;
    this.stateUnsavedChanges = unsavedChanges;
  }
}
