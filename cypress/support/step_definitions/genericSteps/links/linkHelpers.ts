declare global {
  interface String {
    replaceAll(search: string | RegExp, replacement: string): string;
  }
}

/** Normalize visible text for robust matching.*/
function normalizeText(s: string): string {
  const RE_SPACES = /\s+/g;
  return (s ?? '').replaceAll(RE_SPACES, ' ').trim();
}

type PaginationInfo = { current: number; total: number };

const SELECTORS = {
  // Resilient pagination selectors
  list:
    'nav[id$="pagination"] .moj-pagination__list, ' +
    'nav[aria-label*="Pagination"] .moj-pagination__list, ' +
    '.moj-pagination .moj-pagination__list',
  link: '.moj-pagination__link',
  active: '[aria-current="page"].moj-pagination__item--active, .moj-pagination__item--active',
  resultsText: '.moj-pagination__results', // “Showing X to Y of Z results”
};

/** Type guard to keep TypeScript + linters happy */
function isRegExpExecArray(x: RegExpExecArray | null): x is RegExpExecArray {
  return x !== null;
}

/* ------------------------------------------------------------------------------------------------
 * Sub-navigation (tabs)
 * ----------------------------------------------------------------------------------------------*/

/**
 * If a MOJ sub-navigation is present, try to click a tab whose visible text
 * includes the given label (e.g., "Failed", "Rejected (3)").
 * Returns true if clicked, false if subnav absent or no match after retries.
 */
function clickSubnavTabIfPresent(
  tabText: string,
  {
    containerSelector = '.moj-sub-navigation',
    linkSelector = '.moj-sub-navigation__link',
    attempts = 6,
    delayMs = 300,
  }: {
    containerSelector?: string;
    linkSelector?: string;
    attempts?: number;
    delayMs?: number;
  } = {},
): Cypress.Chainable<boolean> {
  const target = normalizeText(tabText).toLowerCase();

  const tryOnce = (): Cypress.Chainable<boolean> =>
    cy.get('body').then(($body) => {
      const $container = $body.find(containerSelector);
      if ($container.length === 0) {
        Cypress.log({ name: 'tab-scan', message: ['no subnav present'] });
        return cy.wrap(false, { log: false });
      }

      const $links = $container.find(linkSelector);
      Cypress.log({
        name: 'tab-scan',
        message: [`count=${$links.length}`, `target="${tabText}"`, `selectors="${containerSelector} ${linkSelector}"`],
      });

      const list = $links.toArray();
      const match = list.find((el) =>
        normalizeText(el.textContent || '')
          .toLowerCase()
          .includes(target),
      );

      if (match) {
        Cypress.log({ name: 'tab-scan', message: ['FOUND → clicking'] });
        return cy
          .wrap(match)
          .scrollIntoView()
          .click({ force: true })
          .then(() => true);
      }

      return cy.wrap(false, { log: false });
    });

  const loop = (i: number): Cypress.Chainable<boolean> =>
    tryOnce().then((hit) => {
      if (hit) return cy.wrap(true, { log: false });
      if (i + 1 >= attempts) return cy.wrap(false, { log: false });
      if (delayMs > 0) cy.wait(delayMs);
      return loop(i + 1);
    });

  return loop(0);
}

/* ------------------------------------------------------------------------------------------------
 * Generic element clicker (tabs/buttons/links by text)
 * ----------------------------------------------------------------------------------------------*/

/**
 * Try to find and click any element (link/tab/button) whose visible text
 * matches exactly or contains the target. Returns true if clicked.
 */
function tryClickElementByText(
  text: string,
  {
    selectors = ['a', 'button', '[role="tab"]', '.moj-sub-navigation__link'],
    exact = false,
    caseSensitive = false,
  }: {
    selectors?: string[];
    exact?: boolean;
    caseSensitive?: boolean;
  } = {},
): Cypress.Chainable<boolean> {
  const targetRaw = normalizeText(text);
  const target = caseSensitive ? targetRaw : targetRaw.toLowerCase();
  const sel = selectors.join(',');

  return cy.get('body').then(($body) => {
    const $els = $body.find(sel);
    Cypress.log({
      name: 'elem-scan',
      message: [`count=${$els.length}`, `selectors="${sel}"`, `target="${targetRaw}"`, `exact=${!!exact}`],
    });

    const list = $els.toArray();
    const match = list.find((el) => {
      const txt = normalizeText(el.textContent || '');
      const cmp = caseSensitive ? txt : txt.toLowerCase();
      return exact ? cmp === target : cmp.includes(target);
    });

    if (match) {
      Cypress.log({ name: 'elem-scan', message: ['FOUND → clicking'] });
      return cy
        .wrap(match)
        .click({ force: true })
        .then(() => true);
    }

    Cypress.log({ name: 'elem-scan', message: ['NOT found'] });
    return cy.wrap(false, { log: false });
  });
}

/* ------------------------------------------------------------------------------------------------
 * Pagination parsers
 * ----------------------------------------------------------------------------------------------*/

/** First pagination list found or null. */
function getPaginationList(doc: Document): Element | null {
  const all = doc.querySelectorAll(SELECTORS.list);
  return all.length ? all[0] : null; // no cast; NodeListOf<Element>
}

/** Try “Page X of Y” from the active pagination element’s aria-label. */
function parseActiveFromLabel(el: Element | null): number | null {
  if (!el) return null;
  const label = (el.getAttribute('aria-label') || '').trim();
  const m = /Page\s+(\d+)\s+of\s+(\d+)/i.exec(label);
  if (!m) return null;
  const n = Number.parseInt(m[1], 10);
  return Number.isFinite(n) ? n : null;
}

/** Fallback: parse active page number from innerText. */
function parseActiveFromText(el: Element | null): number | null {
  if (!el) return null;
  const txt = normalizeText(el.textContent || '');
  const n = Number.parseInt(txt, 10);
  return Number.isFinite(n) ? n : null;
}

/** Infer total pages from anchors (aria “Page X of Y” wins; else max numeric text). */
function inferTotalFromAnchors(list: Element): number | null {
  const anchors = Array.from(list.querySelectorAll(SELECTORS.link));

  const totalsFromLabels = anchors
    .map((a) => (a.getAttribute('aria-label') || '').trim())
    .map((t) => /Page\s+\d+\s+of\s+(\d+)/i.exec(t))
    .filter(isRegExpExecArray)
    .map((m) => Number.parseInt(m[1], 10))
    .filter(Number.isFinite);

  if (totalsFromLabels.length) return Math.max(...totalsFromLabels);

  const nums = anchors.map((a) => Number.parseInt(normalizeText(a.textContent || ''), 10)).filter(Number.isFinite);

  return nums.length ? Math.max(...nums) : null;
}

/** Infer total pages from the “Showing X to Y of Z results” line. */
function inferTotalFromResultsLine(doc: Document): number | null {
  const el = doc.querySelector(SELECTORS.resultsText);
  if (!el) return null;

  const raw = normalizeText(el.textContent || '');
  const m = /Showing\s+(\d+)\s+to\s+(\d+)\s+of\s+(\d+)\s+results/i.exec(raw);
  if (!m) return null;

  const from = Number.parseInt(m[1], 10);
  const to = Number.parseInt(m[2], 10);
  const totalResults = Number.parseInt(m[3], 10);
  if (![from, to, totalResults].every(Number.isFinite) || to < from) return null;

  const perPage = Math.max(to - from + 1, 1);
  return Math.max(Math.ceil(totalResults / perPage), 1);
}

/* ------------------------------------------------------------------------------------------------
 * Core: readPaginationInfo
 * ----------------------------------------------------------------------------------------------*/

/** Read pagination; default to {1,1} if absent. */
function readPaginationInfo(): Cypress.Chainable<PaginationInfo> {
  return cy.document().then((doc) => {
    const list = getPaginationList(doc);
    if (!list) {
      Cypress.log({ name: 'pagination', message: ['no pagination present → {current:1,total:1}'] });
      return { current: 1, total: 1 };
    }

    const activeEl = list.querySelector(SELECTORS.active);
    const current = parseActiveFromLabel(activeEl) ?? parseActiveFromText(activeEl) ?? 1;
    const total = inferTotalFromAnchors(list) ?? inferTotalFromResultsLine(doc) ?? 1;

    const info = { current, total: Math.max(total, 1) };
    Cypress.log({ name: 'pagination', message: [`current=${info.current}`, `total=${info.total}`] });
    return info;
  });
}

/* ------------------------------------------------------------------------------------------------
 * Link scanning (exact anchor match on current page)
 * ----------------------------------------------------------------------------------------------*/

/**
 * Try to find and click a link with exact visible text on the current page.
 * Returns true if clicked; false if not found.
 */
function tryClickLinkOnCurrentPage(linkText: string, linkSelector = 'a'): Cypress.Chainable<boolean> {
  const target = normalizeText(linkText);

  return cy.get('body').then(($body) => {
    const $anchors = $body.find(linkSelector);
    Cypress.log({
      name: 'link-scan',
      message: [`anchors=${$anchors.length}`, `selector=${linkSelector}`, `target="${target}"`],
    });

    const anchors = $anchors.toArray();
    const match = anchors.find((el) => normalizeText(el.textContent || '') === target);

    if (match) {
      Cypress.log({ name: 'link-scan', message: ['FOUND on current page → clicking'] });
      return cy
        .wrap(match)
        .click()
        .then(() => true);
    }

    Cypress.log({ name: 'link-scan', message: ['NOT found on current page'] });
    return cy.wrap(false, { log: false });
  });
}

/* ------------------------------------------------------------------------------------------------
 * Pagination navigation
 * ----------------------------------------------------------------------------------------------*/

/**
 * Click a specific page by number
 * Always returns Chainable<undefined>.
 * - If already on that page, it does nothing.
 * - Otherwise tries aria-label first, then numeric text.
 */
function clickPage(
  page: number,
  { waitAfterPageMs = 200, routeToWaitForAlias }: { waitAfterPageMs?: number; routeToWaitForAlias?: string } = {},
): Cypress.Chainable<undefined> {
  const ariaPrefix = `Page ${page} of`;

  return cy.then<undefined>(() => {
    Cypress.log({ name: 'page-click', message: [`target=${page}`, `waitMs=${waitAfterPageMs}`] });

    cy.get(SELECTORS.list).then(($list) => {
      const $listJq = Cypress.$($list);

      // Already on target page?
      const $active = $listJq.find(SELECTORS.active);
      const activeNum = Number.parseInt(normalizeText($active.text()), 10);
      if (Number.isFinite(activeNum) && activeNum === page) {
        Cypress.log({ name: 'page-click', message: [`already on page ${page} — no click needed`] });
        return;
      }

      const $links = $listJq.find(SELECTORS.link);
      Cypress.log({ name: 'page-click', message: [`foundLinks=${$links.length}`] });

      let $candidate = Cypress.$();
      const $byAria = $links.filter((_i, el) => (el.getAttribute('aria-label') || '').trim().startsWith(ariaPrefix));
      if ($byAria.length) {
        $candidate = $byAria.first();
      } else {
        const $byText = $links.filter((_i, el) => normalizeText(el.textContent || '') === String(page));
        if ($byText.length) $candidate = $byText.first();
      }

      if ($candidate.length === 0) {
        Cypress.log({ name: 'page-click', message: [`NO CANDIDATE for page=${page}`, `ariaPrefix="${ariaPrefix}"`] });
        throw new Error(`Pagination: no anchor found for page ${page}`);
      }

      Cypress.log({ name: 'page-click', message: [`clicking="${normalizeText($candidate.text())}"`] });
      cy.wrap($candidate, { log: false }).click({ force: true });
    });

    if (routeToWaitForAlias) {
      Cypress.log({ name: 'page-click', message: [`waiting route ${routeToWaitForAlias}`] });
      cy.wait(routeToWaitForAlias);
    }
    if (waitAfterPageMs > 0) cy.wait(waitAfterPageMs);

    return undefined;
  });
}

/* ------------------------------------------------------------------------------------------------
 * Scans (multi-page and single-page)
 * ----------------------------------------------------------------------------------------------*/

/** Multi-page scan: pages 1..last until link is found; returns Chainable<undefined>. */
function scanPagesAndClick(
  linkText: string,
  last: number,
  {
    linkSelector = 'a',
    waitAfterPageMs = 200,
    routeToWaitForAlias,
  }: { linkSelector?: string; waitAfterPageMs?: number; routeToWaitForAlias?: string } = {},
): Cypress.Chainable<undefined> {
  const loop = (page: number): Cypress.Chainable<undefined> => {
    if (page > last) {
      throw new Error(`Link "${linkText}" not found after scanning ${last} page(s).`);
    }
    Cypress.log({ name: 'scan', message: [`page=${page}/${last}`, `target="${linkText}"`] });

    return clickPage(page, { waitAfterPageMs, routeToWaitForAlias })
      .then(() => tryClickLinkOnCurrentPage(linkText, linkSelector))
      .then((found) => {
        if (found) {
          Cypress.log({ name: 'scan', message: [`FOUND on page ${page}`] });
          return cy.wrap(undefined, { log: false });
        }
        Cypress.log({ name: 'scan', message: [`not on page ${page} → next`] });
        return loop(page + 1);
      })
      .then<undefined>(() => undefined);
  };

  return loop(1);
}

/** Single-page retry: re-checks for a link; optional refresh between attempts. */
function waitAndClickLinkOnSinglePage(
  linkText: string,
  {
    linkSelector = 'a',
    attempts = 6,
    delayMs = 500,
    refreshSelector,
    routeToWaitForAlias,
  }: {
    linkSelector?: string;
    attempts?: number;
    delayMs?: number;
    refreshSelector?: string;
    routeToWaitForAlias?: string;
  } = {},
): Cypress.Chainable<undefined> {
  const loop = (n: number): Cypress.Chainable<undefined> => {
    Cypress.log({ name: 'single-page-scan', message: [`attempt=${n + 1}/${attempts}`, `target="${linkText}"`] });

    return tryClickLinkOnCurrentPage(linkText, linkSelector)
      .then((found) => {
        if (found) {
          Cypress.log({ name: 'single-page-scan', message: ['FOUND → clicked'] });
          return cy.wrap(undefined, { log: false });
        }

        if (n + 1 >= attempts) {
          throw new Error(`Link "${linkText}" not found on single page after ${attempts} attempts.`);
        }

        if (refreshSelector) {
          Cypress.log({ name: 'single-page-scan', message: [`refresh via ${refreshSelector}`] });
          cy.get(refreshSelector).click({ force: true });
          if (routeToWaitForAlias) cy.wait(routeToWaitForAlias);
        }

        if (delayMs > 0) cy.wait(delayMs);

        return loop(n + 1);
      })
      .then<undefined>(() => undefined);
  };

  return loop(0);
}

/* ------------------------------------------------------------------------------------------------
 * Public: click across pages (with retries)
 * ----------------------------------------------------------------------------------------------*/

/** Retry wrapper for pagination read to allow SPA screens to finish rendering. */
function readPaginationInfoWithRetry(retries = 5, delayMs = 500): Cypress.Chainable<PaginationInfo> {
  const attempt = (n: number): Cypress.Chainable<PaginationInfo> =>
    readPaginationInfo().then((info) => {
      if (info.total === 1 && n < retries) {
        Cypress.log({ name: 'pagination', message: [`total=1, retry ${n + 1}/${retries}`] });
        if (delayMs > 0) cy.wait(delayMs);
        return attempt(n + 1);
      }
      return cy.wrap(info, { log: false });
    });

  return attempt(0);
}

/**
 * Decide between single-page retry and multi-page scan based on pagination.
 */
function clickViaPaginationOrSinglePage(
  linkText: string,
  {
    linkSelector = 'a',
    maxPages,
    waitAfterPageMs = 200,
    routeToWaitForAlias,
    paginationRetries = 5,
    paginationRetryDelayMs = 500,
    singlePageRetries = 6,
    singlePageRetryDelayMs = 500,
    singlePageRefreshSelector,
  }: {
    linkSelector?: string;
    maxPages: number;
    waitAfterPageMs?: number;
    routeToWaitForAlias?: string;
    paginationRetries?: number;
    paginationRetryDelayMs?: number;
    singlePageRetries?: number;
    singlePageRetryDelayMs?: number;
    singlePageRefreshSelector?: string;
  },
): Cypress.Chainable<undefined> {
  return readPaginationInfoWithRetry(paginationRetries, paginationRetryDelayMs)
    .then(({ total }) => {
      Cypress.log({ name: 'click-across', message: [`pagination total=${total}`] });

      if (total <= 1) {
        return waitAndClickLinkOnSinglePage(linkText, {
          linkSelector,
          attempts: singlePageRetries,
          delayMs: singlePageRetryDelayMs,
          refreshSelector: singlePageRefreshSelector,
          routeToWaitForAlias,
        });
      }

      const last = Math.min(total, maxPages);
      return scanPagesAndClick(linkText, last, {
        linkSelector,
        waitAfterPageMs,
        routeToWaitForAlias,
      });
    })
    .then<undefined>(() => undefined);
}

/**
 * Click a link across paginated pages.
 * Strategy:
 *  0) If sub-navigation tabs exist, prefer those (partial match, retried)
 *  1) Exact anchor on current page
 *  2) Flexible element scan (a|button|[role=tab]|.moj-sub-navigation__link)
 *  3) Read pagination (with retry) → single-page retry OR multi-page scan
 */
function clickLinkAcrossPages(
  linkText: string,
  {
    linkSelector = 'a',
    maxPages = 50,
    waitAfterPageMs = 200,
    routeToWaitForAlias,
    paginationRetries = 5,
    paginationRetryDelayMs = 500,
    singlePageRetries = 6,
    singlePageRetryDelayMs = 500,
    singlePageRefreshSelector,
  }: {
    linkSelector?: string;
    maxPages?: number;
    waitAfterPageMs?: number;
    routeToWaitForAlias?: string;
    paginationRetries?: number;
    paginationRetryDelayMs?: number;
    singlePageRetries?: number;
    singlePageRetryDelayMs?: number;
    singlePageRefreshSelector?: string;
  } = {},
): Cypress.Chainable<undefined> {
  Cypress.log({
    name: 'click-across',
    message: [
      `target="${linkText}"`,
      `maxPages=${maxPages}`,
      `pgnRetries=${paginationRetries}`,
      `pgnDelay=${paginationRetryDelayMs}ms`,
      `singleRetries=${singlePageRetries}`,
      `singleDelay=${singlePageRetryDelayMs}ms`,
      singlePageRefreshSelector ? `refresh="${singlePageRefreshSelector}"` : 'refresh=<none>',
    ],
  });

  return clickSubnavTabIfPresent(linkText, { attempts: 6, delayMs: 300 })
    .then((tabHit) => {
      if (tabHit) {
        Cypress.log({ name: 'click-across', message: ['hit via subnav tab'] });
        return cy.wrap(undefined, { log: false });
      }

      return tryClickLinkOnCurrentPage(linkText, linkSelector).then((hit) => {
        if (hit) {
          Cypress.log({ name: 'click-across', message: ['hit on first page (exact link)'] });
          return cy.wrap(undefined, { log: false });
        }

        return tryClickElementByText(linkText, {
          selectors: ['a', 'button', '[role="tab"]', '.moj-sub-navigation__link'],
          exact: false,
          caseSensitive: false,
        }).then((hit2) => {
          if (hit2) {
            Cypress.log({ name: 'click-across', message: ['hit via flexible element match'] });
            return cy.wrap(undefined, { log: false });
          }

          return clickViaPaginationOrSinglePage(linkText, {
            linkSelector,
            maxPages,
            waitAfterPageMs,
            routeToWaitForAlias,
            paginationRetries,
            paginationRetryDelayMs,
            singlePageRetries,
            singlePageRetryDelayMs,
            singlePageRefreshSelector,
          });
        });
      });
    })
    .then<undefined>(() => undefined);
}
/* Exports for reuse in other steps/tests */
export {
  clickLinkAcrossPages,
  tryClickLinkOnCurrentPage,
  readPaginationInfo,
  readPaginationInfoWithRetry,
  waitAndClickLinkOnSinglePage,
  scanPagesAndClick,
  clickPage,
  normalizeText,
  clickSubnavTabIfPresent,
  tryClickElementByText,
};
