import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@constants/fines';
import { GlobalStateService } from '@services';
import { FinesMacDefaultDaysComponent } from '../../flows/fines/fines-mac/components';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, FinesMacDefaultDaysComponent],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  public readonly globalStateService = inject(GlobalStateService);
  public readonly finesRoutingPaths = FINES_ROUTING_PATHS;
}
