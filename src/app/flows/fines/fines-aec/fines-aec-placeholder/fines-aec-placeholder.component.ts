import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FINES_AEC_ROUTING_PATHS } from '../routing/constants/fines-aec-routing-paths.constant';
import { FinesAecStore } from '../stores/fines-aec.store';

@Component({
  selector: 'app-fines-aec-placeholder',
  imports: [RouterLink],
  templateUrl: './fines-aec-placeholder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAecPlaceholderComponent {
  private readonly activatedRoute = inject(ActivatedRoute);

  @Input() public heading = this.activatedRoute.snapshot.data['heading'] as string;
  @Input() public isTab = false;
  public readonly store = inject(FinesAecStore);
  public readonly routingPaths = FINES_AEC_ROUTING_PATHS;
}
