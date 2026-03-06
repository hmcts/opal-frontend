import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-fines-consolidation',
  imports: [RouterOutlet],
  templateUrl: './fines-con.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesConComponent {}
