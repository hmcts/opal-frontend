import { ChangeDetectionStrategy, Component } from '@angular/core';
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
}
