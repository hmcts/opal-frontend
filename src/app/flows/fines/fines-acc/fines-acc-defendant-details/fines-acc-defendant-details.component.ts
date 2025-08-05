import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-fines-acc-defendant-details',
  imports: [RouterOutlet],
  templateUrl: './fines-acc-defendant-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantDetailsComponent {}
