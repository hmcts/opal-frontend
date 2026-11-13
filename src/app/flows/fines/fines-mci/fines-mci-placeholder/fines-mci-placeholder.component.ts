import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fines-mci-placeholder',
  template: `
    <div class="govuk-grid-column-two-thirds">
      <h1 class="govuk-heading-l">{{ heading }}</h1>
      @if (message) {
        <p class="govuk-body">{{ message }}</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciPlaceholderComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  public readonly heading = this.activatedRoute.snapshot.data['heading'] as string;
  public readonly message = this.activatedRoute.snapshot.data['message'] as string | undefined;
}
