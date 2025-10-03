import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FINES_DEFAULT_VALUES } from '../../constants/fines-default-values.constant';

@Component({
  selector: 'app-fines-not-provided',
  templateUrl: './fines-not-provided.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesNotProvidedComponent {
  public readonly defaultValues = FINES_DEFAULT_VALUES;
}
