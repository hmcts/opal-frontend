import type { Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { sendSsrResponse } from './ssr-response';

const ssoConfiguration = { login: '/sso/login', logout: '/sso/logout' };

function createResponse() {
  const redirect = vi.fn();
  const send = vi.fn();
  return { response: { redirect, send } as unknown as Pick<Response, 'redirect' | 'send'>, redirect, send };
}

describe('sendSsrResponse', () => {
  it('sends rendered HTML when no SSO redirect was recorded', async () => {
    const { response, redirect, send } = createResponse();

    await sendSsrResponse(async () => '<main>Ready</main>', response, ssoConfiguration);

    expect(send).toHaveBeenCalledWith('<main>Ready</main>');
    expect(redirect).not.toHaveBeenCalled();
  });

  it.each(['login', 'logout'] as const)('sends a top-level redirect for SSO %s', async (target) => {
    const { response, redirect, send } = createResponse();

    await sendSsrResponse(
      async (recordRedirect) => {
        recordRedirect(target);
        return '<main>Protected</main>';
      },
      response,
      ssoConfiguration,
    );

    expect(redirect).toHaveBeenCalledWith(302, ssoConfiguration[target]);
    expect(send).not.toHaveBeenCalled();
  });

  it('keeps overlapping SSR redirects isolated by render', async () => {
    const first = createResponse();
    const second = createResponse();
    let finishFirstRender!: () => void;

    const firstRender = sendSsrResponse(
      async (recordRedirect) => {
        recordRedirect('login');
        await new Promise<void>((resolve) => {
          finishFirstRender = resolve;
        });
        return 'first';
      },
      first.response,
      ssoConfiguration,
    );

    await sendSsrResponse(
      async (recordRedirect) => {
        recordRedirect('logout');
        return 'second';
      },
      second.response,
      ssoConfiguration,
    );
    finishFirstRender();
    await firstRender;

    expect(first.redirect).toHaveBeenCalledWith(302, '/sso/login');
    expect(second.redirect).toHaveBeenCalledWith(302, '/sso/logout');
  });
});
