import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-moj-page-header',

  imports: [],
  templateUrl: './moj-page-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './moj-page-header.component.scss',
})
export class MojPageHeaderComponent {
  @Input({ required: true }) title!: string;
}
