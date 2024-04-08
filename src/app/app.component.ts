import { Component, NgZone, OnInit, inject } from '@angular/core';
import { LaunchDarklyService } from '@services';
import { from, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private readonly launchDarklyService = inject(LaunchDarklyService);
  private launchDarklyFlags$ = from(this.launchDarklyService.initializeLaunchDarklyFlags()).pipe(
    tap(() => this.launchDarklyService.initializeLaunchDarklyChangeListener()),
  );

  constructor(private readonly ngZone: NgZone) {
    // There is something odd with the launch darkly lib that requires us to run it outside of the angular zone to initialize
    // https://angular.io/errors/NG0506
    this.ngZone.runOutsideAngular(() => {
      this.launchDarklyService.initializeLaunchDarklyClient();
    });
  }

  ngOnInit(): void {
    this.launchDarklyFlags$.subscribe();
  }
}
