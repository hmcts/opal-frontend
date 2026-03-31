import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FinesConStore } from './stores/fines-con.store';

@Component({
  selector: 'app-fines-consolidation',
  imports: [RouterOutlet],
  templateUrl: './fines-con.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesConComponent implements OnDestroy {
  private readonly finesConStore = inject(FinesConStore);

  public ngOnDestroy(): void {
    this.finesConStore.resetConsolidationState();
  }
}
