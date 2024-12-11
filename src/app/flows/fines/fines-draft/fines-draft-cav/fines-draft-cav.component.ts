import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-fines-draft-cav',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './fines-draft-cav.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesDraftCavComponent {}
