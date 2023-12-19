import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GovukTabListItemComponent, GovukTabPanelComponent, GovukTabsComponent } from '@components';

@Component({
  selector: 'app-account-enquiry-details',
  standalone: true,
  imports: [CommonModule, RouterModule, GovukTabsComponent, GovukTabListItemComponent, GovukTabPanelComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent {}
