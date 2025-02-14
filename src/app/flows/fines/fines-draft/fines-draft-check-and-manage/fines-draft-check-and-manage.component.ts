import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-fines-draft-check-and-manage',
  imports: [RouterOutlet],
  templateUrl: './fines-draft-check-and-manage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesDraftCheckAndManageComponent {}
