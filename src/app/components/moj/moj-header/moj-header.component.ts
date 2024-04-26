import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StateService } from '@services';
import { MojHeader } from 'src/app/enums/moj-header';

@Component({
  selector: 'app-moj-header',
  standalone: true,
  imports: [],
  templateUrl: './moj-header.component.html',
  styleUrl: './moj-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojHeaderComponent {
  public readonly header = MojHeader;
  public readonly stateService = inject(StateService);
}
