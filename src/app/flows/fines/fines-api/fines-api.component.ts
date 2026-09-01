import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-fines-api',
  imports: [RouterOutlet],
  templateUrl: './fines-api.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesApiComponent {}
