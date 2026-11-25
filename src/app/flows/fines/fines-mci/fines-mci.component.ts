import { ChangeDetectionStrategy, Component, HostListener, ViewChild, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { activeRoutedFormHasUnsavedChanges } from '../utils/active-routed-form-unsaved.utils';
import { FinesMciStore } from './stores/fines-mci.store';

@Component({
  selector: 'app-fines-mci',
  imports: [RouterOutlet],
  template: '<router-outlet />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciComponent {
  @ViewChild(RouterOutlet) private readonly routerOutlet?: RouterOutlet;
  private readonly finesMciStore = inject(FinesMciStore);

  /** Warns before leaving the tab when form edits or in-memory MCI data would be lost. */
  @HostListener('window:beforeunload')
  public handleBeforeUnload(): boolean {
    return !(
      activeRoutedFormHasUnsavedChanges(this.routerOutlet) ||
      this.finesMciStore.businessUnit() ||
      this.finesMciStore.tills().length ||
      this.finesMciStore.draftJourney() ||
      this.finesMciStore.courtFeeDraft() ||
      this.finesMciStore.courtFeePaymentDetails() ||
      this.finesMciStore.suspensePayment() ||
      this.finesMciStore.criminalSearch()
    );
  }
}
