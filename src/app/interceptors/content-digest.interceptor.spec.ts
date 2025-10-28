import { HttpEvent, HttpHandlerFn, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { firstValueFrom, Observable, of } from 'rxjs';
import { contentDigestInterceptor } from './content-digest.interceptor';

async function computeSha256Digest(body: unknown): Promise<string> {
  const bodyString = typeof body === 'string' ? body : JSON.stringify(body);
  if (typeof bodyString !== 'string') {
    throw new TypeError('Tests require serializable JSON input.');
  }

  const textEncoder = new TextEncoder();
  const bytes = textEncoder.encode(bodyString);
  const cryptoApi = (globalThis as { crypto?: Crypto }).crypto;
  if (!cryptoApi?.subtle) {
    throw new Error('Web Crypto API is not available during tests.');
  }

  const digest = await cryptoApi.subtle.digest('SHA-256', bytes);
  const digestBytes = new Uint8Array(digest);

  if (typeof btoa === 'function') {
    let binary = '';
    for (const value of digestBytes) {
      binary += String.fromCodePoint(value);
    }
    return btoa(binary);
  }

  const bufferCtor = (globalThis as { Buffer?: { from(input: Uint8Array): { toString(encoding: 'base64'): string } } })
    .Buffer;
  if (bufferCtor) {
    return bufferCtor.from(digestBytes).toString('base64');
  }

  throw new Error('Base64 encoding is not supported in this test environment.');
}

function callInterceptor(
  req: HttpRequest<unknown>,
  handler: (req: HttpRequest<unknown>) => Observable<HttpEvent<unknown>>,
) {
  const httpHandler: HttpHandlerFn = (outReq) => handler(outReq);
  return contentDigestInterceptor(req, httpHandler);
}

describe('contentDigestInterceptor (response validation)', () => {
  it('passes through JSON responses when the digest matches', async () => {
    const body = { success: true };
    const digest = await computeSha256Digest(body);
    const response = new HttpResponse({
      body,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Content-Digest': `sha-256=:${digest}:`,
      }),
    });
    const initialRequest = new HttpRequest('POST', '/test', body);

    const result = await firstValueFrom(callInterceptor(initialRequest, () => of(response)));

    expect(result).toBe(response);
  });

  it('throws when the response digest does not match the payload', async () => {
    const body = { name: 'opal' };
    const digest = await computeSha256Digest({ name: 'expected' });
    const response = new HttpResponse({
      body,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Content-Digest': `sha-256=:${digest}:`,
      }),
    });
    const initialRequest = new HttpRequest('POST', '/test', body);

    await expectAsync(firstValueFrom(callInterceptor(initialRequest, () => of(response)))).toBeRejectedWithError(
      'Response content digest mismatch detected.',
    );
  });

  it('throws when the Content-Digest header is malformed', async () => {
    const body = { status: 'ok' };
    const response = new HttpResponse({
      body,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Content-Digest': 'sha-256=abc',
      }),
    });
    const initialRequest = new HttpRequest('POST', '/test', body);

    await expectAsync(firstValueFrom(callInterceptor(initialRequest, () => of(response)))).toBeRejectedWithError(
      'Malformed Content-Digest header: missing sha-256 entry.',
    );
  });

  it('ignores responses without a Content-Digest header', async () => {
    const body = { done: true };
    const response = new HttpResponse({
      body,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
    const initialRequest = new HttpRequest('POST', '/test', body);

    const result = await firstValueFrom(callInterceptor(initialRequest, () => of(response)));

    expect(result).toBe(response);
  });

  it('ignores non-JSON responses even when Content-Digest is present', async () => {
    const body = '<html/>';
    const response = new HttpResponse({
      body,
      headers: new HttpHeaders({
        'Content-Type': 'text/html',
        'Content-Digest': 'sha-256=:not-checked:',
      }),
    });
    const initialRequest = new HttpRequest('POST', '/test', body);

    const result = await firstValueFrom(callInterceptor(initialRequest, () => of(response)));

    expect(result).toBe(response);
  });
});
