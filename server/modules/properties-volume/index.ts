import * as propertiesVolume from '@hmcts/properties-volume';
import config from 'config';
import { Application } from 'express';

export class PropertiesVolume {
  enableFor(server: Application): void {
    if (server.locals['ENV'] !== 'development') {
      propertiesVolume.addTo(config);
    }
  }
}
