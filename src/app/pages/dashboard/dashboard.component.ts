import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ScotgovDatePickerComponent } from '@components';
import { StateService } from '@services';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, ScotgovDatePickerComponent],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  public readonly stateService = inject(StateService);
}
