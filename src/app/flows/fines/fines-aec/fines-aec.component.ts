import { Component, ChangeDetectionStrategy, HostListener, ViewChild, inject, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { activeRoutedFormHasUnsavedChanges } from '../utils/active-routed-form-unsaved.utils';
import { FinesAecStore } from './stores/fines-aec.store';

@Component({
  selector: 'app-fines-aec',
  imports: [RouterOutlet],
  templateUrl: './fines-aec.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAecComponent implements OnDestroy {
  @ViewChild(RouterOutlet) private readonly routerOutlet?: RouterOutlet;
  private readonly store = inject(FinesAecStore);
  private readonly opalFines = inject(OpalFines);
  private readonly globalStore = inject(GlobalStore);

  /**
   * Checks the active form before a browser unload, which bypasses the router's unsaved-changes guard.
   * @returns True when the page can unload without losing unsaved form edits.
   */
  @HostListener('window:beforeunload')
  public handleBeforeUnload(): boolean {
    return !activeRoutedFormHasUnsavedChanges(this.routerOutlet);
  }

  /** Clears flow state, cached account type thresholds and request banners when the AEC wrapper is destroyed. */
  public ngOnDestroy(): void {
    this.store.resetStore();
    this.opalFines.clearCache('enforcementAccountTypesCache$');
    this.globalStore.resetBannerError();
  }
}
