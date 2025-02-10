import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ApplicationInsights, ITelemetryItem } from '@microsoft/applicationinsights-web';
import { ITransferStateAppInsightsConfig } from '@services/transfer-state-service/interfaces/transfer-state-app-insights-config.interface';
import { TransferStateService } from '@services/transfer-state-service/transfer-state.service';

@Injectable({
  providedIn: 'root',
})
export class AppInsightsService {
  private readonly appInsights!: ApplicationInsights;
  private readonly appInsightsConfig!: ITransferStateAppInsightsConfig | undefined;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly transferStateService = inject(TransferStateService);

  constructor() {
    this.appInsightsConfig = this.transferStateService.serverTransferState?.appInsightsConfig;

    if (isPlatformBrowser(this.platformId) && this.appInsightsConfig) {
      if (this.appInsightsConfig.enabled) {
        this.appInsights = new ApplicationInsights({
          config: {
            connectionString: this.appInsightsConfig.connectionString!,
            enableAutoRouteTracking: true,
          },
        });

        this.appInsights.addTelemetryInitializer(this.telemetryInitializer.bind(this));
        this.appInsights.loadAppInsights();
      }
    }
  }

  /**
   * Adds a telemetry initializer to set the cloud role name for the telemetry item.
   *
   * @param envelope - The telemetry item to which the cloud role name will be added.
   */
  private telemetryInitializer(envelope: ITelemetryItem): void {
    envelope.tags = envelope.tags || {};
    if (this.appInsightsConfig?.enabled) {
      envelope.tags['ai.cloud.role'] = this.appInsightsConfig.cloudRoleName!;
    }
  }

  /**
   * Logs a page view to the Application Insights service.
   *
   * @param name - The name of the page. Optional.
   * @param url - The URL of the page. Optional.
   *
   * This method uses the Application Insights SDK to track a page view event.
   * If the `name` or `url` parameters are not provided, the SDK will use default values.
   */
  public logPageView(name?: string, url?: string): void {
    if (!this.appInsightsConfig?.enabled) {
      return;
    }
    this.appInsights.trackPageView({ name, uri: url });
  }

  /**
   * Logs an exception to the Application Insights service.
   *
   * @param exception - The error object to be logged.
   * @param severityLevel - Optional. The severity level of the exception. If not provided, a default severity level will be used.
   */
  public logException(exception: Error, severityLevel?: number): void {
    if (!this.appInsightsConfig?.enabled) {
      return;
    }
    this.appInsights.trackException({ exception, severityLevel });
  }
}
