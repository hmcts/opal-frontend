import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-fines-cav',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './fines-cav.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesCavComponent {}
