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

  /**
   * Handles the click event of a sub-navigation item.
   * @param event - The click event.
   * @param item - The item string.
   */
  public handleItemClick(event: Event, item: string): void {
    event.preventDefault();
    // Basically we want to mimic the behaviour of the GDS tabs component, as this is how these will be used.
    this.router.navigate(['./'], { relativeTo: this.route, fragment: item });
  }
}
