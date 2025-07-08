import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-fines-sa-search-account-form-minor-creditors',
  imports: [],
  templateUrl: './fines-sa-search-account-form-minor-creditors.component.html',
  styles: ``,
})
export class FinesSaSearchAccountFormMinorCreditorsComponent {
  @Input({ required: true }) public form!: FormGroup;
}
