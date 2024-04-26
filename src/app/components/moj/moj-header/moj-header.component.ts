import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StateService } from '@services';
import { MojHeaderLinks } from '@enums';
@Component({
  selector: 'app-moj-header',
  standalone: true,
  imports: [],
  templateUrl: './moj-header.component.html',
  styleUrl: './moj-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojHeaderComponent {
  public readonly headerLinks = MojHeaderLinks;
  public readonly stateService = inject(StateService);
}
