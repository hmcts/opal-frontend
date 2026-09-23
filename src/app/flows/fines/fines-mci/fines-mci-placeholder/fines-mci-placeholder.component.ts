import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fines-mci-placeholder',
  template: '<div class="govuk-grid-column-two-thirds"><h1 class="govuk-heading-l">{{ heading }}</h1></div>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciPlaceholderComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  public readonly heading = this.activatedRoute.snapshot.data['heading'] as string;
}
