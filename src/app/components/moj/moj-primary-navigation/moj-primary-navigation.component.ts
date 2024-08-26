import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { IMojPrimaryNavigationItem } from './interfaces';

@Component({
  selector: 'app-moj-primary-navigation',
  standalone: true,
  imports: [],
  templateUrl: './moj-primary-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojPrimaryNavigationComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private ngUnsubscribe = new Subject<void>();

  @Input({ required: true }) public primaryNavigationId!: string;
  @Input({ required: true }) public navigationItems!: IMojPrimaryNavigationItem[];
  @Output() activeItemFragment = new EventEmitter<string>();

  /**
   * Sets up the listeners for the route fragment changes.
   * Emits the active navigation item when a fragment is present in the route.
   */
  private setupListeners(): void {
    // Basically we want to mimic the behaviour of the GDS tabs component, as this is how these will be used.
    this.route.fragment.pipe(takeUntil(this.ngUnsubscribe)).subscribe((fragment) => {
      if (fragment) {
        this.activeItemFragment.emit(fragment);
      }
    });
  }

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

  /**
   * Initializes the component.
   * This method is called after the component has been created and initialized.
   */
  public ngOnInit(): void {
    this.setupListeners();
  }

  /**
   * Lifecycle hook that is called when the component is about to be destroyed.
   * Unsubscribes from the route fragment subscription.
   */
  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
