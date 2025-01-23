import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FinesMacReviewAccountDefaultValues } from '../enums/fines-mac-review-account-default-values.enum';

@Component({
  selector: 'app-fines-mac-review-account-not-provided',
  imports: [],
  templateUrl: './fines-mac-review-account-not-provided.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacReviewAccountNotProvidedComponent {
  public readonly defaultValues = FinesMacReviewAccountDefaultValues;
}
