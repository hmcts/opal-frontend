import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-manual-account-creation',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './manual-account-creation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManualAccountCreationComponent {}
