import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FINES_MAC_REVIEW_ACCOUNT_DEFAULT_VALUES } from '../constants/fines-mac-review-account-default-values.constant';

@Component({
  selector: 'app-fines-mac-review-account-not-provided',
  imports: [],
  templateUrl: './fines-mac-review-account-not-provided.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacReviewAccountNotProvidedComponent {
  public readonly defaultValues = FINES_MAC_REVIEW_ACCOUNT_DEFAULT_VALUES;
}
