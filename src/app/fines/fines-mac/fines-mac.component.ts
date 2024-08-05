import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-fines-mac',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './fines-mac.component.html',
  styleUrl: './fines-mac.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacComponent {}
