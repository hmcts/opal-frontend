import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-fines-draft-create-and-manage',
  imports: [RouterOutlet],
  templateUrl: './fines-draft-create-and-manage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesDraftCreateAndManageComponent {}
