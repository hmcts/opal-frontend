import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, ViewChild, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OpalFines } from '../services/opal-fines-service/opal-fines.service';
import { activeRoutedFormHasUnsavedChanges } from '../utils/active-routed-form-unsaved.utils';

@Component({
  selector: 'app-fines-draft',
  imports: [RouterOutlet],
  templateUrl: './fines-draft.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesDraftComponent implements OnDestroy {
  @ViewChild(RouterOutlet) private readonly routerOutlet?: RouterOutlet;

  private readonly opalFines = inject(OpalFines);

  @HostListener('window:beforeunload')
  public handleBeforeUnload(): boolean {
    return !activeRoutedFormHasUnsavedChanges(this.routerOutlet);
  }

  public ngOnDestroy(): void {
    this.opalFines.clearDraftAccountsCache();
  }
}
