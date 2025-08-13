import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FINES_DEFAULT_VALUES } from '../../../constants/fines-default-values.constant';

@Component({
  selector: 'app-fines-mac-review-account-not-provided',
  imports: [],
  templateUrl: './fines-mac-review-account-not-provided.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacReviewAccountNotProvidedComponent {
  public readonly defaultValues = FINES_DEFAULT_VALUES;
}
