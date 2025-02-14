import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
import { GovukCancelLinkComponent } from '@components/govuk/govuk-cancel-link/govuk-cancel-link.component';
import { GovukTextAreaComponent } from '@components/govuk/govuk-text-area/govuk-text-area.component';
import { IFinesConfAccountCommentsNotesForm } from '../interfaces/fines-conf-account-comments-notes-form.interface';
import { CommonModule } from '@angular/common';
import { AbstractAccountCommentsAndNotesComponent } from '../../../components/abstract/abstract-account-comments-and-notes/abstract-account-comments-and-notes';
import { FinesConfiscationStore } from '../../stores/fines-confiscation.store';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';

@Component({
  selector: 'app-fines-conf-account-comments-notes-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GovukButtonComponent,
    GovukCancelLinkComponent,
    GovukTextAreaComponent,
  ],
  templateUrl: './fines-conf-account-comments-notes-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesConfAccountCommentsNotesFormComponent
  extends AbstractAccountCommentsAndNotesComponent
  implements OnInit, OnDestroy
{
  @Output() protected override formSubmit = new EventEmitter<IFinesConfAccountCommentsNotesForm>();

  private readonly finesConfiscationStore = inject(FinesConfiscationStore);
  public mandatorySectionsCompleted!: boolean;

  protected readonly routingPaths = PAGES_ROUTING_PATHS;

  /**
   * Performs the initial setup for the fines-mac-account-comments-notes-form component.
   * This method sets up the account comments notes form, and populates the form with data.
   */
  private initialAccountCommentsNotesSetup(): void {
    const { formData } = this.finesConfiscationStore.accountCommentsNotes();
    this.setupForm('conf');
    this.rePopulateForm(formData);
  }

  public override ngOnInit(): void {
    this.initialAccountCommentsNotesSetup();
    super.ngOnInit();
  }
}
