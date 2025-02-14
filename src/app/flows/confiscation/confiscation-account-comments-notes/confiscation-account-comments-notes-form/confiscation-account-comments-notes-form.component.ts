import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
import { GovukCancelLinkComponent } from '@components/govuk/govuk-cancel-link/govuk-cancel-link.component';
import { GovukTextAreaComponent } from '@components/govuk/govuk-text-area/govuk-text-area.component';
import { IConfiscationAccountCommentsNotesForm } from '../interfaces/confiscation-account-comments-notes-form.interface';
import { CommonModule } from '@angular/common';
import { AbstractAccountCommentsAndNotesComponent } from '../../../components/abstract/abstract-account-comments-and-notes/abstract-account-comments-and-notes';
import { ConfiscationStore } from '../../stores/confiscation.store';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';

@Component({
  selector: 'app-confiscation-account-comments-notes-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GovukButtonComponent,
    GovukCancelLinkComponent,
    GovukTextAreaComponent,
  ],
  templateUrl: './confiscation-account-comments-notes-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiscationAccountCommentsNotesFormComponent
  extends AbstractAccountCommentsAndNotesComponent
  implements OnInit, OnDestroy
{
  @Output() protected override formSubmit = new EventEmitter<IConfiscationAccountCommentsNotesForm>();

  private readonly confiscationStore = inject(ConfiscationStore);
  public mandatorySectionsCompleted!: boolean;

  protected readonly routingPaths = PAGES_ROUTING_PATHS;

  /**
   * Performs the initial setup for the fines-mac-account-comments-notes-form component.
   * This method sets up the account comments notes form, and populates the form with data.
   */
  private initialAccountCommentsNotesSetup(): void {
    const { formData } = this.confiscationStore.accountCommentsNotes();
    this.setupForm('conf');
    this.rePopulateForm(formData);
  }

  public override ngOnInit(): void {
    this.initialAccountCommentsNotesSetup();
    super.ngOnInit();
  }
}
