import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-fines-reports',
  imports: [RouterOutlet],
  templateUrl: './fines-reports.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesReportsComponent {}
