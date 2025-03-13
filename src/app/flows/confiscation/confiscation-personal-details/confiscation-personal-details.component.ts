import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractFormParentBaseComponent } from '@components/abstract/abstract-form-parent-base/abstract-form-parent-base.component';
import { IConfiscationPersonalDetailsForm } from './interfaces/confiscation-personal-details-form.interface';
import { ConfiscationPersonalDetailsFormComponent } from './confiscation-personal-details-form/confiscation-personal-details-form.component';
import { ConfiscationStore } from '../stores/confiscation.store';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';

@Component({
  selector: 'app-confiscation-personal-details',
  imports: [ConfiscationPersonalDetailsFormComponent],
  templateUrl: './confiscation-personal-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiscationPersonalDetailsComponent extends AbstractFormParentBaseComponent {
  private readonly confiscationStore = inject(ConfiscationStore);

  /**
   * Handles the submission of personal details form.
   *
   * @param form - The personal details form data.
   * @returns void
   */
  public handlePersonalDetailsSubmit(form: IConfiscationPersonalDetailsForm): void {
    this.confiscationStore.setPersonalDetails(form);
    this.routerNavigate(PAGES_ROUTING_PATHS.children.dashboard);
  }

  /**
   * Handles unsaved changes coming from the child component
   *
   * @param unsavedChanges boolean value from child component
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public handleUnsavedChanges(unsavedChanges: any): void {
    this.confiscationStore.setUnsavedChanges(unsavedChanges);
    this.stateUnsavedChanges = unsavedChanges;
  }
}
