import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-fines',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './fines.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesComponent {}
