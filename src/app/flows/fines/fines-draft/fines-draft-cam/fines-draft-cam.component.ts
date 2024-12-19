import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-fines-draft-cam',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './fines-draft-cam.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesDraftCamComponent {}
