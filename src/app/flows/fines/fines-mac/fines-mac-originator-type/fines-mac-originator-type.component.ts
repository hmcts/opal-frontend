import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { FinesMacStore } from '../stores/fines-mac.store';
import { IFinesMacOriginatorTypeForm } from './interfaces/fines-mac-originator-type-form.interface';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths.constant';
import { FinesMacOriginatorTypeFormComponent } from './fines-mac-originator-type-form/fines-mac-originator-type-form.component';

@Component({
  selector: 'app-fines-mac-originator-type',
  imports: [RouterModule, FinesMacOriginatorTypeFormComponent],
  templateUrl: './fines-mac-originator-type.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOriginatorTypeComponent extends AbstractFormParentBaseComponent {
  private readonly finesMacStore = inject(FinesMacStore);

  public handleOriginatorTypeSubmit(form: IFinesMacOriginatorTypeForm): void {
    this.finesMacStore.setOriginatorType(form);

    this.routerNavigate(FINES_MAC_ROUTING_PATHS.children.createAccount);
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
