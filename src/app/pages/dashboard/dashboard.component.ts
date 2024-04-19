import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AlphagovAccessibleAutocompleteComponent } from '@components';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, AlphagovAccessibleAutocompleteComponent],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {}
