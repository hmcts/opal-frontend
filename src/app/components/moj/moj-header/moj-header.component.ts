import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MOJ_HEADER_LINKS } from './constants/moj-header-links.constant';

@Component({
  selector: 'app-moj-header',
  imports: [RouterLink],
  templateUrl: './moj-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojHeaderComponent {
  public readonly headerLinks = MOJ_HEADER_LINKS;
}
