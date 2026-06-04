/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

type RequestHeaders = Record<string, unknown>;
type RequestOptions = Partial<Cypress.RequestOptions> & {
  body?: Cypress.RequestBody;
  headers?: RequestHeaders;
  method?: string;
  url?: string;
};
type RequestOriginalFn = (...args: unknown[]) => Cypress.Chainable<Cypress.Response<unknown>>;

const OPAL_API_PATH_PREFIXES = ['/opal-fines-service', '/opal-user-service'];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const normalizeRequestOptions = (args: unknown[]): RequestOptions | null => {
  const [first, second, third] = args;

  if (isRecord(first) && typeof first['url'] === 'string') {
    return { ...(first as RequestOptions) };
  }

  if (typeof first === 'string' && typeof second === 'string') {
    return {
      method: first,
      url: second,
      body: third as Cypress.RequestBody | undefined,
    };
  }

  if (typeof first === 'string') {
    return {
      method: 'GET',
      url: first,
      body: second as Cypress.RequestBody | undefined,
    };
  }

  return null;
};

const isOpalApiProxyUrl = (url: string): boolean => {
  const baseUrl = Cypress.config('baseUrl') || 'http://localhost';
  const pathname = new URL(url, baseUrl).pathname;

  return OPAL_API_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
};

const findHeaderValue = (headers: RequestHeaders | undefined, name: string): unknown => {
  const normalizedName = name.toLowerCase();
  const matchingKey = Object.keys(headers ?? {}).find((key) => key.toLowerCase() === normalizedName);

  return matchingKey ? headers?.[matchingKey] : undefined;
};

const hasHeader = (headers: RequestHeaders | undefined, name: string): boolean =>
  findHeaderValue(headers, name) !== undefined;

const isJsonContentType = (headers: RequestHeaders | undefined): boolean => {
  const contentType = findHeaderValue(headers, 'Content-Type');

  return typeof contentType === 'string' && (contentType.includes('application/json') || contentType.includes('+json'));
};

const shouldDigestRequest = (options: RequestOptions): boolean => {
  const method = (options.method ?? 'GET').toUpperCase();

  return (
    method !== 'GET' &&
    method !== 'HEAD' &&
    !options.form &&
    typeof options.url === 'string' &&
    isOpalApiProxyUrl(options.url) &&
    options.body !== undefined &&
    options.body !== null &&
    !hasHeader(options.headers, 'Content-Digest') &&
    (typeof options.body !== 'string' || isJsonContentType(options.headers))
  );
};

const serializeJsonRequestBody = (body: Cypress.RequestBody): string => {
  if (typeof body === 'string') {
    return body;
  }

  return JSON.stringify(body);
};

Cypress.Commands.overwrite('request', (originalFn, ...args: unknown[]) => {
  const originalRequest = originalFn as RequestOriginalFn;
  const options = normalizeRequestOptions(args);

  if (!options || !shouldDigestRequest(options)) {
    return originalRequest(...args);
  }

  const body = serializeJsonRequestBody(options.body as Cypress.RequestBody);

  return cy.task<string>('contentDigest:sha512Base64', body, { log: false }).then((digest) =>
    originalRequest({
      ...options,
      body,
      headers: {
        ...options.headers,
        'Content-Digest': `sha-512=:${digest}:`,
        'Want-Content-Digest': 'sha-512',
        ...(hasHeader(options.headers, 'Content-Type') ? {} : { 'Content-Type': 'application/json' }),
      },
    }),
  );
});
