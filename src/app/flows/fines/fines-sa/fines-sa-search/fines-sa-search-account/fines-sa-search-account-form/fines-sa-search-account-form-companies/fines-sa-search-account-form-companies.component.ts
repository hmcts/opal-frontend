import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-fines-sa-search-account-form-companies',
  imports: [],
  templateUrl: './fines-sa-search-account-form-companies.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSaSearchAccountFormCompaniesComponent {
  @Input({ required: true }) public form!: FormGroup;
}
