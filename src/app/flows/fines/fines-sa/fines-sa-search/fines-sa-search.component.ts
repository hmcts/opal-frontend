import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CanDeactivateTypes } from '@hmcts/opal-frontend-common/guards/can-deactivate/types';
import { FinesSaStore } from '../stores/fines-sa.store';

@Component({
  selector: 'app-fines-sa-search',
  imports: [RouterOutlet],
  templateUrl: './fines-sa-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSaSearchComponent {
  private readonly finesSaStore = inject(FinesSaStore);
  /**
   * If the user navigates externally from the site or closes the tab
   * Check if there is state changes -> warning message
   * Otherwise -> no warning message
   *
   * @returns boolean
   */
  canDeactivate(): CanDeactivateTypes {
    if (this.finesSaStore.unsavedChanges()) {
      return false;
    } else if (this.finesSaStore.searchAccountPopulated()) {
      return false;
    } else {
      return true;
    }
  }
}
