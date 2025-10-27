import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { from, of } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';

type WebCryptoLike = {
  subtle?: {
    digest: (algorithm: string, data: ArrayBufferLike) => Promise<ArrayBuffer>;
  };
};

/**
 * Computes a SHA-256 digest for the provided bytes and encodes it as a base64 string.
 */
async function sha256Base64(bytes: Uint8Array): Promise<string> {
  // Use whichever Web Crypto implementation is available (browser or server-side).
  const cryptoApi = (globalThis as { crypto?: WebCryptoLike }).crypto;
  if (!cryptoApi?.subtle) {
    throw new Error('Web Crypto API is not available.');
  }

  const data = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  const hash = await cryptoApi.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hash);
  if (typeof btoa === 'function') {
    // Browser path: convert hash bytes to a base64 string.
    let binary = '';
    for (const value of hashArray) {
      binary += String.fromCodePoint(value);
    }
    return btoa(binary);
  }

  // Node path: fall back to Buffer for base64 encoding.
  const bufferCtor = (globalThis as { Buffer?: { from(data: Uint8Array): { toString(encoding: 'base64'): string } } })
    .Buffer;
  if (bufferCtor) {
    return bufferCtor.from(hashArray).toString('base64');
  }

  throw new Error('Base64 encoding is not supported in this environment.');
}

/**
 * Returns true when the provided content type represents JSON.
 */
function isJsonContentType(ct: string | null | undefined): boolean {
  if (!ct) {
    return false;
  }

  const normalized = ct.toLowerCase();
  return normalized.includes('application/json') || normalized.includes('+json');
}

/**
 * Determines whether the request should have a content digest applied.
 */
function shouldDigestJsonRequest(req: HttpRequest<unknown>): boolean {
  if (!req.body || req.method === 'GET' || req.method === 'HEAD') {
    return false;
  }

  const contentType = req.headers.get('Content-Type');
  if (isJsonContentType(contentType)) {
    return true;
  }

  const bodyType = typeof req.body;
  // No explicit header: treat plain object-like bodies as JSON payloads.
  const isPlainObject =
    bodyType === 'object' && req.body !== null && !(req.body instanceof FormData) && !(req.body instanceof Blob);

  return isPlainObject;
}

/**
 * Adds integrity headers for JSON requests while ensuring the serialized payload matches the digest.
 */
export const contentDigestInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const wantDigestHeader = { 'Want-Content-Digest': 'sha-256' };
  const responseValidator = mergeMap((event: HttpEvent<unknown>) => validateResponseContentDigest(event));
  if (!shouldDigestJsonRequest(req)) {
    // Always request digests from the server even when we skip hashing.
    return next(req.clone({ setHeaders: wantDigestHeader })).pipe(responseValidator);
  }

  const bodyString = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  const bytes = new TextEncoder().encode(bodyString);
  return from(sha256Base64(bytes)).pipe(
    switchMap((digest) => {
      const setHeaders: Record<string, string> = {
        'Content-Digest': `sha-256=:${digest}:`,
        'Want-Content-Digest': 'sha-256',
      };
      if (!req.headers.has('Content-Type')) {
        setHeaders['Content-Type'] = 'application/json';
      }

      // Send the serialized body together with the computed digest headers.
      return next(
        req.clone({
          setHeaders,
          body: bodyString,
        }),
      ).pipe(responseValidator);
    }),
  );
};

/**
 * Validates Content-Digest response headers for JSON payloads.
 */
function validateResponseContentDigest(event: HttpEvent<unknown>) {
  console.log('Validating response content digest...');
  console.log(event);
  if (!(event instanceof HttpResponse)) {
    return of(event);
  }

  const contentType = event.headers.get('Content-Type');
  if (!isJsonContentType(contentType)) {
    return of(event);
  }

  const digestHeader = event.headers.get('Content-Digest');
  if (!digestHeader) {
    return of(event);
  }

  const expectedDigest = extractSha256Digest(digestHeader);
  const normalizedBody = event.body ?? null;
  const bodyString = typeof normalizedBody === 'string' ? normalizedBody : JSON.stringify(normalizedBody);
  if (typeof bodyString !== 'string') {
    throw new TypeError('Unable to serialize JSON response body for digest verification.');
  }

  const bytes = new TextEncoder().encode(bodyString);
  return from(sha256Base64(bytes)).pipe(
    map((actualDigest) => {
      if (actualDigest !== expectedDigest) {
        throw new Error('Response content digest mismatch detected.');
      }
      return event;
    }),
  );
}

const SHA256_CONTENT_DIGEST_REGEX = /^sha-256=:([A-Z0-9+/]+={0,2}):$/i;

function extractSha256Digest(headerValue: string): string {
  const candidates = headerValue
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  for (const candidate of candidates) {
    const match = SHA256_CONTENT_DIGEST_REGEX.exec(candidate);
    if (match) {
      return match[1];
    }
  }

  throw new Error('Malformed Content-Digest header: missing sha-256 entry.');
}
