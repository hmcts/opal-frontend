import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-fines-sa-search-account-form-major-creditors',
  imports: [],
  templateUrl: './fines-sa-search-account-form-major-creditors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSaSearchAccountFormMajorCreditorsComponent {
  @Input({ required: true }) public form!: FormGroup;
}
