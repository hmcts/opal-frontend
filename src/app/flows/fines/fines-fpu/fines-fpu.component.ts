import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesFpuStore } from './stores/fines-fpu.store';

@Component({
  selector: 'app-fines-fpu',
  imports: [RouterOutlet],
  templateUrl: './fines-fpu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesFpuComponent implements OnDestroy {
  private readonly finesFpuStore = inject(FinesFpuStore);
  private readonly opalFines = inject(OpalFines);

  /**
   * Checks whether the browser can unload without discarding journey changes.
   *
   * @returns Whether the journey has no unsaved changes.
   */
  @HostListener('window:beforeunload')
  public handleBeforeUnload(): boolean {
    return !this.finesFpuStore.unsavedChanges();
  }

  /**
   * Supplies the journey's unsaved state to the route leave guard.
   *
   * @returns Whether navigation can proceed without confirmation.
   */
  public canDeactivate(): boolean {
    return !this.finesFpuStore.unsavedChanges();
  }

  /** Clears journey state and cached draft accounts so the next visit resolves current data. */
  public ngOnDestroy(): void {
    this.finesFpuStore.resetFinesFpuState();
    this.opalFines.clearDraftAccountsCache();
  }
}
