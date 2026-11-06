import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-fines-reports-create',
  imports: [RouterLink],
  templateUrl: './fines-reports-create.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesReportsCreateComponent {}
