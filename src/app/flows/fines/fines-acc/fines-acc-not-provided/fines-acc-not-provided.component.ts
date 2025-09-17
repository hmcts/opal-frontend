import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FINES_DEFAULT_VALUES } from '../../constants/fines-default-values.constant';

@Component({
  selector: 'app-fines-acc-not-provided',
  imports: [],
  templateUrl: './fines-acc-not-provided.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccNotProvidedComponent {
  public readonly defaultValues = FINES_DEFAULT_VALUES;
}
