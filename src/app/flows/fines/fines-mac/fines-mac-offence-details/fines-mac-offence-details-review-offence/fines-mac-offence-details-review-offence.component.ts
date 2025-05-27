import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FinesMacOffenceDetailsReviewOffenceHeadingComponent } from './fines-mac-offence-details-review-offence-heading/fines-mac-offence-details-review-offence-heading.component';
import { FinesMacOffenceDetailsReviewOffenceImpositionComponent } from './fines-mac-offence-details-review-offence-imposition/fines-mac-offence-details-review-offence-imposition.component';
import { IFinesMacOffenceDetailsForm } from '../interfaces/fines-mac-offence-details-form.interface';
import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';
import { IOpalFinesMajorCreditorRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-major-creditor-ref-data.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fines-mac-offence-details-review-offence',
  imports: [
    FinesMacOffenceDetailsReviewOffenceHeadingComponent,
    FinesMacOffenceDetailsReviewOffenceImpositionComponent,
  ],
  templateUrl: './fines-mac-offence-details-review-offence.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsReviewOffenceComponent implements OnInit {
  @Input({ required: true }) offence!: IFinesMacOffenceDetailsForm;
  @Input({ required: true }) impositionRefData!: IOpalFinesResultsRefData;
  @Input({ required: true }) majorCreditorRefData!: IOpalFinesMajorCreditorRefData;
  @Input({ required: false }) showActions!: boolean;
  @Input({ required: false }) showDetails: boolean = true;
  @Input({ required: false }) isReadOnly: boolean = false;
  @Output() public actionClicked = new EventEmitter<{ actionName: string; offenceId: number }>();

  private readonly activatedRoute = inject(ActivatedRoute);

  /**
   * Emits an action event with the specified action name and offence ID.
   *
   * @param event - An object containing the action name and offence ID.
   * @param event.actionName - The name of the action to be emitted.
   * @param event.offenceId - The ID of the offence related to the action.
   * @returns void
   */
  public emitAction(event: { actionName: string; offenceId: number }): void {
    this.actionClicked.emit(event);
  }

  public ngOnInit(): void {
    if (this.activatedRoute.snapshot.data['results']) {
      this.impositionRefData = this.activatedRoute.snapshot.data['results'];
    }
    if (this.activatedRoute.snapshot.data['majorCreditors']) {
      this.majorCreditorRefData = this.activatedRoute.snapshot.data['majorCreditors'];
    }
  }
}
