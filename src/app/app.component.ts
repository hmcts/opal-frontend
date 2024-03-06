import { Component } from '@angular/core';
import { LaunchDarklyService } from './services/launch-darkly/launch-darkly.service';

@Component({
  selector: 'app-root',
  providers: [LaunchDarklyService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'opal-frontend';

  constructor(private launchDarklyService: LaunchDarklyService) {
    this.launchDarklyService.initializeLaunchDarklyClient();
  }
}
