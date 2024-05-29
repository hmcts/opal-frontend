import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-govuk-heading-with-caption',
  standalone: true,
  imports: [],
  templateUrl: './govuk-heading-with-caption.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukHeadingWithCaptionComponent {
  @Input({ required: true }) captionText!: string;
  @Input({ required: true }) headingText!: string;
}
