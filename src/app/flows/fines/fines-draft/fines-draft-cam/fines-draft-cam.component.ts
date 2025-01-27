import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-fines-draft-cam',

  imports: [RouterOutlet],
  templateUrl: './fines-draft-cam.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesDraftCamComponent {}
