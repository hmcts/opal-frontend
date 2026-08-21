import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-fines-finance',
  imports: [RouterOutlet],
  templateUrl: './fines-finance.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesFinanceComponent {}
