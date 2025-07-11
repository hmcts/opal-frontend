import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-fines-acc',
  imports: [RouterOutlet],
  templateUrl: './fines-acc.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccComponent {}
