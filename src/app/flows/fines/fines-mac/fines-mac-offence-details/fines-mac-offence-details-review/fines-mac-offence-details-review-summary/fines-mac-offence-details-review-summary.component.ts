import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_MAC_ROUTING_PATHS } from '../../../routing/constants/fines-mac-routing-paths.constant';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../../routing/constants/fines-mac-offence-details-routing-paths.constant';
import { FinesMacOffenceDetailsReviewSummaryDateOfSentenceComponent } from './fines-mac-offence-details-review-summary-date-of-sentence/fines-mac-offence-details-review-summary-date-of-sentence.component';
import { CommonModule } from '@angular/common';
import { IOpalFinesMajorCreditorRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-major-creditor-ref-data.interface';
import { FinesMacOffenceDetailsReviewSummaryOffencesTotalComponent } from './fines-mac-offence-details-review-summary-offences-total/fines-mac-offence-details-review-summary-offences-total.component';
import { IFinesMacOffenceDetailsReviewSummaryForm } from '../interfaces/fines-mac-offence-details-review-summary-form.interface';
import { FINES_MAC_STATUS } from '../../../constants/fines-mac-status';
import { FinesMacOffenceDetailsReviewOffenceComponent } from '../../fines-mac-offence-details-review-offence/fines-mac-offence-details-review-offence.component';
import { IFinesMacOffenceDetailsReviewSummaryDetailsHidden } from '../interfaces/fines-mac-offence-details-review-summary-details-hidden.interface';
import { FinesMacStore } from '../../../stores/fines-mac.store';
import { FinesMacOffenceDetailsStore } from '../../stores/fines-mac-offence-details.store';
import { MojAlertComponent } from '@hmcts/opal-frontend-common/components/moj/moj-alert';
import { MojAlertContentComponent } from '@hmcts/opal-frontend-common/components/moj/moj-alert';
import { MojAlertTextComponent } from '@hmcts/opal-frontend-common/components/moj/moj-alert';
import { MojAlertIconComponent } from '@hmcts/opal-frontend-common/components/moj/moj-alert';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';

@Component({
  selector: 'app-fines-mac-offence-details-review-summary',
  imports: [
    CommonModule,
    GovukButtonComponent,
    GovukCancelLinkComponent,
    MojAlertComponent,
    MojAlertContentComponent,
    MojAlertTextComponent,
    MojAlertIconComponent,
    FinesMacOffenceDetailsReviewSummaryDateOfSentenceComponent,
    FinesMacOffenceDetailsReviewSummaryOffencesTotalComponent,
    FinesMacOffenceDetailsReviewOffenceComponent,
  ],
  templateUrl: './fines-mac-offence-details-review-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './fines-mac-offence-details-review-summary.component.scss',
})
export class FinesMacOffenceDetailsReviewSummaryComponent implements OnInit, OnDestroy {
  @Input({ required: true }) public impositionRefData!: IOpalFinesResultsRefData;
  @Input({ required: true }) public majorCreditorRefData!: IOpalFinesMajorCreditorRefData;
  @Input({ required: true }) public offencesImpositions!: IFinesMacOffenceDetailsReviewSummaryForm[];
  @Input({ required: false }) public isReadOnly = false;

  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly finesMacStore = inject(FinesMacStore);
  protected readonly finesMacOffenceDetailsStore = inject(FinesMacOffenceDetailsStore);

  public readonly finesMacStatus = FINES_MAC_STATUS;
  protected readonly finesMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly fineMacOffenceDetailsRoutingPaths = FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS;

  public offencesHidden!: IFinesMacOffenceDetailsReviewSummaryDetailsHidden;

  /**
   * Hides the offence details by setting the corresponding offence ID to false in the accumulator object.
   *
   * @private
   * @returns {void}
   */
  private offenceDetailsHidden(): void {
    this.offencesHidden = this.offencesImpositions.reduce((acc, offence) => {
      const offenceId = offence.formData.fm_offence_details_id;

      if (offenceId !== null) {
        acc[offenceId] = true;
      }

      return acc;
    }, {} as IFinesMacOffenceDetailsReviewSummaryDetailsHidden);
  }

  /**
   * Returns the maximum offence ID from the `offencesImpositions` array.
   * @returns The maximum offence ID.
   */
  private getMaxOffenceId(): number {
    return this.offencesImpositions.reduce(
      (max, offence) => (offence.formData.fm_offence_details_id > max ? offence.formData.fm_offence_details_id : max),
      0,
    );
  }

  /**
   * Checks if the defendant type is 'adultOrYouthOnly'.
   *
   * @returns {boolean} Returns true if the defendant type is 'adultOrYouthOnly', otherwise returns false.
   */
  private isAdultOrYouthOnly(): boolean {
    return this.finesMacStore.getDefendantType() === 'adultOrYouthOnly';
  }

  /**
   * Handles the action performed on an offence.
   * @param action - The action object containing the action name and offence ID.
   */
  public offenceAction(action: { actionName: string; offenceId: number }): void {
    this.finesMacOffenceDetailsStore.setOffenceIndex(action.offenceId);
    if (action.actionName === 'change') {
      this.handleRoute(FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addOffence);
    } else if (action.actionName === 'remove') {
      this.handleRoute(FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.removeOffence);
    } else {
      this.offencesHidden[action.offenceId] = !this.offencesHidden[action.offenceId];
    }
  }

  /**
   * Adds another offence.
   */
  public addAnotherOffence(): void {
    this.finesMacOffenceDetailsStore.setOffenceIndex(this.getMaxOffenceId() + 1);
    this.handleRoute(FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addOffence);
  }

  /**
   * Navigates to the specified route.
   * @param route - The route to navigate to.
   * @param event - The optional event object.
   */
  public handleRoute(route: string, nonRelative: boolean = false, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    if (nonRelative) {
      this.router.navigate([`${FINES_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.root}/${route}`]);
    } else {
      this.router.navigate([route], { relativeTo: this.activatedRoute.parent });
    }
  }

  /**
   * Checks the sub-navigation button status based on the provided conditions.
   * If the user is an adult or youth only, it checks if the finesMacStore personalDetails status is provided.
   * Otherwise, it returns true.
   *
   * @returns {boolean} The sub-navigation button status.
   */
  public checkSubNavigationButton(): boolean {
    if (this.isAdultOrYouthOnly()) {
      return this.finesMacStore.personalDetailsStatus() === FINES_MAC_STATUS.PROVIDED;
    }
    return true;
  }

  public ngOnInit(): void {
    if (this.offencesImpositions.length === 0 && !this.finesMacOffenceDetailsStore.offenceRemoved()) {
      this.addAnotherOffence();
    }
    this.offenceDetailsHidden();
  }

  public ngOnDestroy(): void {
    this.finesMacOffenceDetailsStore.setOffenceCodeMessage('');
  }
}
