import * as express from 'express';
import helmet from 'helmet';
import config from 'config';
import { Logger } from '@hmcts/nodejs-logging';

const logger = Logger.getLogger('helmet');
const googleAnalyticsDomain = '*.google-analytics.com';
const self = "'self'";
const dynatraceDomain = '*.dynatrace.com';
const LaunchDarklyDomain = '*.launchdarkly.com';
const applicationInsightsDomain = '*.applicationinsights.azure.com';
/**
 * Module that enables helmet in the application
 */
export class Helmet {
  private readonly developmentMode: boolean;
  constructor(developmentMode: boolean) {
    this.developmentMode = developmentMode;
  }

  public enableFor(app: express.Express): void {
    if (config.get('features.helmet.enabled') === true) {
      logger.info('Helmet enabled');
      // include default helmet functions
      const scriptSrc = [
        self,
        googleAnalyticsDomain,
        dynatraceDomain,
        "'sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU='",
        "'unsafe-inline'",
      ];

      if (this.developmentMode) {
        // Uncaught EvalError: Refused to evaluate a string as JavaScript because 'unsafe-eval'
        // is not an allowed source of script in the following Content Security Policy directive:
        // "script-src 'self' *.google-analytics.com 'sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU='".
        // seems to be related to webpack
        scriptSrc.push("'unsafe-eval'");
      }

      app.use(
        helmet({
          contentSecurityPolicy: {
            directives: {
              connectSrc: [self, dynatraceDomain, LaunchDarklyDomain, applicationInsightsDomain],
              defaultSrc: ["'none'"],
              fontSrc: [self, 'data:', 'https://fonts.gstatic.com'],
              imgSrc: [self, googleAnalyticsDomain],
              objectSrc: [self],
              scriptSrc,
              styleSrc: [self, "'unsafe-inline'", 'https://fonts.googleapis.com'],
              scriptSrcAttr: ["'unsafe-inline'"],
            },
          },
          referrerPolicy: { policy: 'origin' },
        }),
      );
    }
  }
}
