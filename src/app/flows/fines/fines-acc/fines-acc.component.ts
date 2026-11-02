import { ChangeDetectionStrategy, Component, HostListener, inject, OnDestroy, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { FinesAccountStore } from './stores/fines-acc.store';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';

@Component({
  selector: 'app-fines-acc',
  imports: [RouterOutlet],
  templateUrl: './fines-acc.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccComponent implements OnDestroy {
  @ViewChild(RouterOutlet) private readonly routerOutlet?: RouterOutlet;

  private readonly globalStore = inject(GlobalStore);
  private readonly finesAccStore = inject(FinesAccountStore);
  private readonly opalFines = inject(OpalFines);

  constructor() {
    inject(Router)
      .events.pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => this.finesAccStore.clearAprErrorContextForNavigation(event.urlAfterRedirects));
  }

  /** Browser unloads bypass the router guard, so check the active form's unsaved state directly. */
  @HostListener('window:beforeunload')
  public handleBeforeUnload(): boolean {
    const activePage = this.routerOutlet?.isActivated ? this.routerOutlet.component : null;
    return !(activePage instanceof AbstractFormParentBaseComponent && activePage.stateUnsavedChanges);
  }

  public ngOnDestroy(): void {
    // Cleanup our state when the route unloads...
    this.finesAccStore.resetStore();
    this.opalFines.clearAccountDetailsCache();

    // Clear any errors...
    this.globalStore.resetBannerError();
  }
}
