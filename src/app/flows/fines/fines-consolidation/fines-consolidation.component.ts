import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-fines-consolidation',
  imports: [RouterOutlet],
  templateUrl: './fines-consolidation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesConsolidationComponent {}
