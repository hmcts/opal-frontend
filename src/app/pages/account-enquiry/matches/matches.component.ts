import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { GovukButtonComponent } from '@components';

@Component({
  selector: 'app-account-enquiry-matches',
  standalone: true,
  imports: [CommonModule, RouterModule, GovukButtonComponent],
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchesComponent {
  private readonly router = inject(Router);

  public handleBack(): void {
    this.router.navigate(['account-enquiry/search']);
  }
}
