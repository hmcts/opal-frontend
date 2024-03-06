import {
  Component,
  Injectable,
  Inject,
  PLATFORM_ID,
  Optional,
  TransferState,
  makeStateKey,
  InjectionToken,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { LaunchDarklyService } from './services/launch-darkly/launch-darkly.service';

@Component({
  selector: 'app-root',
  providers: [LaunchDarklyService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'opal-frontend';

  constructor() {}
}
