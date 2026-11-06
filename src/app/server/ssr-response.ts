import type { Response } from 'express';
import type { SsoConfiguration } from '@hmcts/opal-frontend-common-node/interfaces';
import type { ServerSsoRedirectTarget } from '@hmcts/opal-frontend-common/guards/auth';

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
