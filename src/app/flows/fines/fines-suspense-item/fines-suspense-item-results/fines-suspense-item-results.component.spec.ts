import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, ParamMap, Data, provideRouter, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OPAL_FINES_SUSPENSE_ITEM_SUMMARY_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-suspense-item-summary.mock';
import { FinesSuspenseItemStore } from '../stores/fines-suspense-item.store';
import { FinesSuspenseItemResultsComponent } from './fines-suspense-item-results.component';

describe('FinesSuspenseItemResultsComponent', () => {
  let fixture: ComponentFixture<FinesSuspenseItemResultsComponent>;
  let routeParameters: BehaviorSubject<ParamMap>;
  let routeData: BehaviorSubject<Data>;

  beforeEach(async () => {
    routeData = new BehaviorSubject<Data>({ summary: null });
    routeParameters = new BehaviorSubject(convertToParamMap({ suspenseItemId: '001234' }));
    await TestBed.configureTestingModule({
      imports: [FinesSuspenseItemResultsComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: routeParameters.value, data: routeData.value },
            paramMap: routeParameters.asObservable(),
            data: routeData.asObservable(),
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(FinesSuspenseItemResultsComponent);
    TestBed.inject(FinesSuspenseItemStore).setSelectedBusinessUnit(11, 'Avon and Somerset');
    fixture.detectChanges();
  });

  afterEach(() => vi.restoreAllMocks());

  it('switches between the found placeholder and not-found content as resolved results change', () => {
    routeData.next({ summary: OPAL_FINES_SUSPENSE_ITEM_SUMMARY_MOCK });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toBe('View suspense item');
    expect(fixture.nativeElement.querySelector('app-fines-suspense-item-results-not-found')).toBeNull();

    routeData.next({ summary: null });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toBe('Suspense item not found');
    expect(fixture.nativeElement.querySelector('app-fines-suspense-item-results-found')).toBeNull();
  });

  it('renders the not-found heading in the journey content column', () => {
    const page: HTMLElement = fixture.nativeElement;

    expect(page.querySelectorAll('h1')).toHaveLength(1);
    expect(page.querySelector('.govuk-grid-column-two-thirds h1')?.textContent).toBe('Suspense item not found');
  });

  it('passes the supplied business unit to the caption and search context', () => {
    fixture.detectChanges();
    const page: HTMLElement = fixture.nativeElement;

    expect(page.querySelector('.govuk-caption-l')?.textContent?.trim()).toBe('Avon and Somerset');
    expect(page.querySelector('.govuk-body-s')?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      'Searching items for Avon and Somerset',
    );

    TestBed.inject(FinesSuspenseItemStore).setSelectedBusinessUnit(35, 'West London');
    fixture.detectChanges();

    expect(page.querySelector('.govuk-caption-l')?.textContent?.trim()).toBe('West London');
    expect(page.querySelector('.govuk-body-s strong')?.textContent).toBe('West London');
  });

  it('renders a labelled text input and Search button above the not-found content', () => {
    const page: HTMLElement = fixture.nativeElement;
    const reference = page.querySelector<HTMLInputElement>('#fsir_suspense_reference_number')!;
    const search = page.querySelector<HTMLButtonElement>('#searchSuspenseItem')!;

    expect(page.querySelector('label[for="fsir_suspense_reference_number"]')?.textContent?.trim()).toBe(
      'Find suspense item',
    );
    expect(reference.type).toBe('text');
    expect(reference.name).toBe('fsir_suspense_reference_number');
    expect(reference.value).toBe('001234');
    expect(search.textContent?.trim()).toBe('Search');
    expect(search.type).toBe('submit');
    expect(
      reference.compareDocumentPosition(page.querySelector('h1')!) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    reference.value = '5678';
    reference.dispatchEvent(new Event('input', { bubbles: true }));

    expect(reference.value).toBe('5678');
    expect(fixture.componentInstance.initialReference()).toBe('001234');
    expect(TestBed.inject(FinesSuspenseItemStore).selectedBusinessUnitId()).toBe(11);
  });

  it('does not invent a business-unit name when context is missing', () => {
    TestBed.inject(FinesSuspenseItemStore).resetStore();
    fixture.detectChanges();
    const page: HTMLElement = fixture.nativeElement;

    expect(page.querySelector('.govuk-caption-l')?.textContent).toBe('');
    expect(page.querySelector('.govuk-body-s strong')?.textContent).toBe('');
  });

  it('starts with an empty reference when the route has no reference', () => {
    vi.spyOn(TestBed.inject(ActivatedRoute).snapshot.paramMap, 'get').mockReturnValue(null);
    const emptyPage = TestBed.createComponent(FinesSuspenseItemResultsComponent);
    emptyPage.detectChanges();
    expect(emptyPage.nativeElement.querySelector('#fsir_suspense_reference_number').value).toBe('');
    emptyPage.destroy();
  });

  it('tracks reference edits and clears the warning on destruction without losing BU context', () => {
    const page: HTMLElement = fixture.nativeElement;
    const reference = page.querySelector<HTMLInputElement>('#fsir_suspense_reference_number')!;
    const store = TestBed.inject(FinesSuspenseItemStore);
    expect(store.unsavedChanges()).toBe(false);
    reference.value = '5678';
    reference.dispatchEvent(new Event('input', { bubbles: true }));
    expect(store.unsavedChanges()).toBe(true);
    expect(fixture.componentInstance['canDeactivate']()).toBe(false);
    fixture.destroy();
    expect(store.unsavedChanges()).toBe(false);
    expect(store.selectedBusinessUnitId()).toBe(11);
    expect(store.selectedBusinessUnitName()).toBe('Avon and Somerset');
  });

  it('navigates to search when the shared Back link is selected', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const page: HTMLElement = fixture.nativeElement;

    page.querySelector<HTMLAnchorElement>('opal-lib-govuk-back-link a')!.click();

    expect(navigate).toHaveBeenCalledExactlyOnceWith(['/', 'fines', 'suspense-item', 'search']);
  });

  it('opens the amended reference on Search while retaining the business unit', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const page: HTMLElement = fixture.nativeElement;
    const input = page.querySelector<HTMLInputElement>('#fsir_suspense_reference_number')!;
    input.value = '005678';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    page.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(navigate).toHaveBeenCalledExactlyOnceWith(['/', 'fines', 'suspense-item', '005678', 'results'], {
      onSameUrlNavigation: 'reload',
    });
    expect(TestBed.inject(FinesSuspenseItemStore).selectedBusinessUnitId()).toBe(11);
    expect(TestBed.inject(FinesSuspenseItemStore).unsavedChanges()).toBe(false);
  });

  it('restores the form warning when results navigation is cancelled', async () => {
    vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(false);
    const input = fixture.nativeElement.querySelector('#fsir_suspense_reference_number');
    input.value = '005678';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    expect(TestBed.inject(FinesSuspenseItemStore).unsavedChanges()).toBe(true);
  });

  it('does not restore a destroyed results form after a pending navigation fails', async () => {
    let failNavigation!: (error: Error) => void;
    vi.spyOn(TestBed.inject(Router), 'navigate').mockReturnValue(
      new Promise<boolean>((_resolve, reject) => {
        failNavigation = reject;
      }),
    );
    fixture.componentInstance.handleFormSubmit({
      formData: { fsir_suspense_reference_number: '005678' },
      nestedFlow: false,
    });
    fixture.destroy();
    failNavigation(new Error('Navigation failed after leaving'));
    await Promise.resolve();
    expect(TestBed.inject(FinesSuspenseItemStore).unsavedChanges()).toBe(false);
  });

  it('updates the input when the existing results page receives another route reference', () => {
    const page: HTMLElement = fixture.nativeElement;
    const input = page.querySelector<HTMLInputElement>('#fsir_suspense_reference_number')!;
    input.value = 'draft';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    routeParameters.next(convertToParamMap({ suspenseItemId: '005678' }));
    fixture.detectChanges();

    expect(input.value).toBe('005678');
    expect(TestBed.inject(FinesSuspenseItemStore).unsavedChanges()).toBe(false);
    expect(page.querySelector('h1')?.textContent).toBe('Suspense item not found');
  });
});
