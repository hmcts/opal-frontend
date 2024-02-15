import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-moj-sub-navigation-item',
  standalone: true,
  imports: [],
  templateUrl: './moj-sub-navigation-item.component.html',
  styleUrl: './moj-sub-navigation-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojSubNavigationItemComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  @Input({ required: true }) public navigationItem!: string;
  @Input({ required: true }) public navigationItemText!: string;
  @Input({ required: true }) public currentNavigationItem!: string;

  public handleItemClick(event: Event, item: string): void {
    event.preventDefault();
    this.router.navigate(['./'], { relativeTo: this.route, fragment: item });
  }
}
