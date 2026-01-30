import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { parseXmlToJson } from './utils/opal-stub-parse-xml.utils';
import { IOpalLegacyOpalRequestOptions } from './utils/interfaces/opal-stub-request-options.interface';

/**
 * Service for making HTTP requests to the OPAL legacy database stub.
 *
 * This service provides methods to interact with the OPAL legacy database stub API,
 * supporting GET, POST, PUT, and DELETE operations. It handles XML to JSON parsing
 * and various response types.
 *
 * @remarks
 * The service is provided in the root injector and uses HttpClient to make HTTP requests.
 * All requests are routed through the base URL `/opal-legacy-db-stub/opal`.
 *
 * @example
 * ```typescript
 * constructor(private opalStubService: OpalStubService) {}
 *
 * // POST request with JSON response
 * this.opalStubService.postLegacyOpal('createRecord', { data: 'value' }, { responseType: 'json' })
 *   .subscribe(response => console.log(response));
 *
 * // GET request with XML to JSON parsing
 * this.opalStubService.getLegacyOpal('fetchData', { parseXmlToJson: true })
 *   .subscribe(data => console.log(data));
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class OpalStubService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/opal-legacy-db-stub';
  private readonly opalPath = '/opal';

  /**
   * Makes an HTTP request to the OPAL legacy database stub.
   *
   * @param method - The HTTP method to use (GET, POST, PUT, DELETE)
   * @param actionType - The action type parameter to include in the request
   * @param options - Configuration options for the request
   * @param body - Optional request body for POST and PUT requests
   * @returns An Observable of the HTTP response
   *
   * @private
   * @remarks
   * This method handles different response types and can automatically parse XML responses to JSON.
   * The method parameter determines which HTTP verb is used for the request.
   */
  private requestLegacyOpal(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    actionType: string,
    options: IOpalLegacyOpalRequestOptions,
    body?: unknown,
  ): Observable<unknown> {
    const params = new HttpParams().set('actionType', actionType);
    const acceptHeader = options.accept ?? (options.parseXmlToJson ? 'application/xml' : undefined);
    const headers = acceptHeader ? { Accept: acceptHeader } : undefined;
    const responseType = options.responseType ?? 'text';
    const url = `${this.baseUrl}${this.opalPath}`;

    if (options.parseXmlToJson) {
      return this.http
        .request(method, url, {
          body,
          params,
          headers,
          responseType: 'text',
        })
        .pipe(map((xml) => parseXmlToJson(xml)));
    }

    if (responseType === 'json') {
      return this.http.request(method, url, { body, params, headers });
    }

    return this.http.request(method, url, { body, params, headers, responseType: 'text' });
  }

  /**
   * Sends a POST request to the OPAL legacy database stub.
   *
   * @param actionType - The action type parameter identifying the operation
   * @param body - The request payload
   * @param options - Optional configuration for the request (default: {})
   * @returns An Observable containing the response data
   *
   * @public
   */
  public postLegacyOpal(
    actionType: string,
    body: unknown,
    options: IOpalLegacyOpalRequestOptions = {},
  ): Observable<unknown> {
    return this.requestLegacyOpal('POST', actionType, options, body);
  }

  /**
   * Sends a GET request to the OPAL legacy database stub.
   *
   * @param actionType - The action type parameter identifying the operation
   * @param options - Optional configuration for the request (default: {})
   * @returns An Observable containing the response data
   *
   * @public
   */
  public getLegacyOpal(actionType: string, options: IOpalLegacyOpalRequestOptions = {}): Observable<unknown> {
    return this.requestLegacyOpal('GET', actionType, options);
  }

  /**
   * Sends a PUT request to the OPAL legacy database stub.
   *
   * @param actionType - The action type parameter identifying the operation
   * @param body - The request payload
   * @param options - Optional configuration for the request (default: {})
   * @returns An Observable containing the response data
   *
   * @public
   */
  public putLegacyOpal(
    actionType: string,
    body: unknown,
    options: IOpalLegacyOpalRequestOptions = {},
  ): Observable<unknown> {
    return this.requestLegacyOpal('PUT', actionType, options, body);
  }

  /**
   * Sends a DELETE request to the OPAL legacy database stub.
   *
   * @param actionType - The action type parameter identifying the operation
   * @param options - Optional configuration for the request (default: {})
   * @returns An Observable containing the response data
   *
   * @public
   */
  public deleteLegacyOpal(actionType: string, options: IOpalLegacyOpalRequestOptions = {}): Observable<unknown> {
    return this.requestLegacyOpal('DELETE', actionType, options);
  }
}
