import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-fines-draft',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './fines-draft.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesDraftComponent {}