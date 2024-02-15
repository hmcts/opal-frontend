import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-moj-sub-navigation',
  standalone: true,
  imports: [],
  templateUrl: './moj-sub-navigation.component.html',
  styleUrl: './moj-sub-navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojSubNavigationComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private routeFragmentSub!: Subscription;

  @Output() activeNavigationItem = new EventEmitter<string>();

  private setupListeners(): void {
    this.routeFragmentSub = this.route.fragment.subscribe((fragment) => {
      console.log('Fragment:', fragment);
      if (fragment) {
        this.activeNavigationItem.emit(fragment);
      }
    });
  }

  ngOnInit(): void {
    this.setupListeners();
  }

  ngOnDestroy(): void {
    this.routeFragmentSub.unsubscribe();
  }
}
