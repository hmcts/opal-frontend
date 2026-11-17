import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FinesFpuStore } from './stores/fines-fpu.store';

@Component({
  selector: 'app-fines-fpu',
  imports: [RouterOutlet],
  templateUrl: './fines-fpu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesFpuComponent implements OnDestroy {
  private readonly finesFpuStore = inject(FinesFpuStore);

  @HostListener('window:beforeunload')
  public handleBeforeUnload(): boolean {
    return !this.finesFpuStore.unsavedChanges();
  }

  public canDeactivate(): boolean {
    return !this.finesFpuStore.unsavedChanges();
  }

  public ngOnDestroy(): void {
    this.finesFpuStore.resetFinesFpuState();
  }
}
