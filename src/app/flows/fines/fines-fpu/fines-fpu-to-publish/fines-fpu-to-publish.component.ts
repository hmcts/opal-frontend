import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { FinesFpuStore } from '../stores/fines-fpu.store';
import { FinesFpuToPublishFormComponent } from './fines-fpu-to-publish-form/fines-fpu-to-publish-form.component';

@Component({
  selector: 'app-fines-fpu-to-publish',
  imports: [FinesFpuToPublishFormComponent],
  templateUrl: './fines-fpu-to-publish.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesFpuToPublishComponent extends AbstractFormParentBaseComponent {
  protected readonly finesFpuStore = inject(FinesFpuStore);

  public override stateUnsavedChanges = false;

  /**
   * Retains the current selection while publication remains a future action.
   *
   * @param selectedBusinessUnitIds - Business units selected in the child form.
   */
  public handleSelectionChanged(selectedBusinessUnitIds: number[]): void {
    this.finesFpuStore.setSelectedBusinessUnitIds(selectedBusinessUnitIds);
  }
}
