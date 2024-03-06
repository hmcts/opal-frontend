import { Injectable } from '@angular/core';
import { initialize, LDClient, LDFlagSet } from 'launchdarkly-js-client-sdk';
// import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LaunchDarklyService {
  ldClient!: LDClient;
  flags!: LDFlagSet;
  // flagChange: Subject<Object> = new Subject<Object>();

  constructor() {}

  public initializeLaunchDarklyClient(key: string) {
    console.log('Initializing LaunchDarkly client', key);
    this.ldClient = initialize(key, {
      // key: '655ddb56ca6d3c12dea9c518',
      anonymous: true,
    });

    this.ldClient.on('ready', () => {
      console.log('LaunchDarkly client is ready');
    });
  }
}
