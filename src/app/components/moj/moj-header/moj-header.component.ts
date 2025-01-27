import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MojHeaderLinks } from './enums';

@Component({
  selector: 'app-moj-header',
  imports: [RouterLink],
  templateUrl: './moj-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojHeaderComponent {
  public readonly headerLinks = MojHeaderLinks;
}
