import type { Response } from 'express';
import type { CommonEngine, CommonEngineRenderOptions } from '@angular/ssr/node';
import type { SsoConfiguration } from '@hmcts/opal-frontend-common-node/interfaces';
import { SERVER_SSO_REDIRECT, type ServerSsoRedirectTarget } from '@hmcts/opal-frontend-common/guards/auth';

/** Renders an Angular request with a per-render SSO redirect callback and sends its response. */
export async function renderSsrResponse(
  engine: Pick<CommonEngine, 'render'>,
  options: CommonEngineRenderOptions,
  response: Pick<Response, 'redirect' | 'send'>,
  ssoConfiguration: Pick<SsoConfiguration, 'login' | 'logout'>,
): Promise<void> {
  await sendSsrResponse(
    (recordRedirect) =>
      engine.render({
        ...options,
        providers: [...(options.providers ?? []), { provide: SERVER_SSO_REDIRECT, useValue: recordRedirect }],
      }),
    response,
    ssoConfiguration,
  );
}

/** Sends a browser-level SSO redirect recorded during this SSR render, or the rendered HTML. */
export async function sendSsrResponse(
  render: (recordRedirect: (target: ServerSsoRedirectTarget) => void) => Promise<string>,
  response: Pick<Response, 'redirect' | 'send'>,
  ssoConfiguration: Pick<SsoConfiguration, 'login' | 'logout'>,
): Promise<void> {
  let redirectTarget: ServerSsoRedirectTarget | undefined;
  const html = await render((target) => {
    redirectTarget = target;
  });

  if (redirectTarget) {
    response.redirect(302, ssoConfiguration[redirectTarget]);
    return;
  }

  response.send(html);
}
