import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-fines-draft-check-and-validate',
  imports: [RouterOutlet],
  templateUrl: './fines-draft-check-and-validate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesDraftCheckAndValidateComponent {}
