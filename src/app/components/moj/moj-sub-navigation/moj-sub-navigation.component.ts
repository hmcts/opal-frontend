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
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-moj-sub-navigation',

  imports: [],
  templateUrl: './moj-sub-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojSubNavigationComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly ngUnsubscribe = new Subject<void>();

  @Input({ required: true }) public subNavId!: string;
  @Output() activeSubNavItemFragment = new EventEmitter<string>();

  /**
   * Sets up the listeners for the route fragment changes.
   * Emits the active navigation item when a fragment is present in the route.
   */
  private setupListeners(): void {
    // Basically we want to mimic the behaviour of the GDS tabs component, as this is how these will be used.
    this.route.fragment.pipe(takeUntil(this.ngUnsubscribe)).subscribe((fragment) => {
      if (fragment) {
        this.activeSubNavItemFragment.emit(fragment);
      }
    });
  }

  ngOnInit(): void {
    this.setupListeners();
  }

  /**
   * Lifecycle hook that is called when the component is about to be destroyed.
   * Unsubscribes from the route fragment subscription.
   */
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
