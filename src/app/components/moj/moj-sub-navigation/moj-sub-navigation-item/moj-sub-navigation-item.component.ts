import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-moj-sub-navigation-item',
  imports: [],
  templateUrl: './moj-sub-navigation-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojSubNavigationItemComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  @Input({ required: true }) public subNavItemId!: string;
  @Input({ required: true }) public subNavItemFragment!: string;
  @Input({ required: true }) public subNavItemText!: string;
  @Input({ required: true }) public activeSubNavItemFragment!: string;

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
