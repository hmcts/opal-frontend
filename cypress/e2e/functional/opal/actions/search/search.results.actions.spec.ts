import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ResultsActions } from './search.results.actions';

vi.mock('../../../../../support/utils/log.helper', () => ({ createScopedLogger: () => vi.fn() }));
vi.mock('../../../../../support/utils/screenshot', () => ({ captureUatTechnicalEvidenceScreenshot: vi.fn() }));

/** Small DOM collection adapter for the jQuery operations used by the action. */
class Collection {
  /**
   * Creates a collection.
   * @param elements Selected DOM elements.
   */
  public constructor(private readonly elements: Element[]) {}

  /**
   * Number of selected elements.
   * @returns Collection size.
   */
  public get length(): number {
    return this.elements.length;
  }

  /**
   * Iterates over the selected elements.
   * @returns Element iterator.
   */
  public [Symbol.iterator](): IterableIterator<Element> {
    return this.elements[Symbol.iterator]();
  }

  /**
   * Finds descendants matching a CSS selector.
   * @param selector CSS selector.
   * @returns Matching descendants.
   */
  public find(selector: string): Collection {
    return new Collection(this.elements.flatMap((element) => Array.from(element.querySelectorAll(selector))));
  }

  /**
   * Selects the first element.
   * @returns First-element collection.
   */
  public first(): Collection {
    return new Collection(this.elements.slice(0, 1));
  }

  /**
   * Copies elements so hidden text can be removed without changing the page.
   * @returns Cloned collection.
   */
  public clone(): Collection {
    return new Collection(this.elements.map((element) => element.cloneNode(true) as Element));
  }

  /** Removes selected elements. */
  public remove(): void {
    this.elements.forEach((element) => element.remove());
  }

  /**
   * Reads the selected elements' text.
   * @returns Combined text.
   */
  public text(): string {
    return this.elements.map((element) => element.textContent).join('');
  }
}

describe('ResultsActions paginated row assertions', () => {
  let actions: ResultsActions;
  let currentPage: number;
  let pages: string[][];
  let clicks: number;

  beforeEach(() => {
    actions = new ResultsActions();
    vi.spyOn(actions, 'waitForResultsTable').mockImplementation(() => undefined);
    currentPage = 0;
    clicks = 0;
    pages = [];
    vi.stubGlobal('expect', expect);
    vi.stubGlobal('Cypress', { $: (element: Element) => new Collection([element]) });

    const render = (): void => {
      document.body.innerHTML = `<opal-lib-moj-sortable-table><table>${pages[currentPage]
        .map((reference) => `<tr opal-lib-moj-sortable-table-row><td id="defendantRef">${reference}</td></tr>`)
        .join('')}</table></opal-lib-moj-sortable-table>${
        currentPage < pages.length - 1
          ? '<nav class="govuk-pagination"><div class="govuk-pagination__next"><a class="govuk-pagination__link">Next</a></div></nav>'
          : ''
      }`;
    };

    vi.stubGlobal('cy', {
      get: (selector: string) => {
        render();
        const elements = new Collection(Array.from(document.querySelectorAll(selector)));
        return {
          then: (callback: (value: Collection) => void) => callback(elements),
          should: (callback: (value: Collection) => void) => callback(elements),
        };
      },
      wrap: () => ({
        scrollIntoView: () => ({
          click: () => {
            currentPage++;
            clicks++;
          },
        }),
      }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
  });

  it('keeps the current page when it already contains the match', () => {
    pages = [['TARGET'], ['OTHER']];
    actions.assertResultsRowMatchesColumns({ Ref: 'TARGET' });
    expect(clicks).toBe(0);
  });

  it('finds a normalized match on a later page and leaves it displayed', () => {
    pages = [['FIRST'], ['SECOND'], [' Target ']];
    actions.assertResultsRowMatchesColumns({ Ref: 'TARGET' });
    expect(currentPage).toBe(2);
    expect(clicks).toBe(2);
  });

  it('fails after exhausting all pages when the reference is absent', () => {
    pages = [['FIRST'], ['SECOND']];
    expect(() => actions.assertResultsRowMatchesColumns({ Ref: 'MISSING' })).toThrow(
      'No results row matched all expected column values across results pages',
    );
    expect(clicks).toBe(1);
  });

  it('rejects unsupported column names without navigating', () => {
    pages = [['FIRST'], ['SECOND']];
    expect(() => actions.assertResultsRowMatchesColumns({ Unknown: 'TARGET' })).toThrow('No column locator mapping');
    expect(clicks).toBe(0);
  });
});
