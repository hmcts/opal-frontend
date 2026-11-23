import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesSuspenseItemResultsComponent } from './fines-suspense-item-results.component';

describe('FinesSuspenseItemResultsComponent', () => {
  let fixture: ComponentFixture<FinesSuspenseItemResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesSuspenseItemResultsComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(FinesSuspenseItemResultsComponent);
    fixture.detectChanges();
  });

  afterEach(() => vi.restoreAllMocks());

  it('renders the not-found heading in the journey content column', () => {
    const page: HTMLElement = fixture.nativeElement;

    expect(page.querySelectorAll('h1')).toHaveLength(1);
    expect(page.querySelector('.govuk-grid-column-two-thirds h1')?.textContent).toBe('Suspense item not found');
  });

  it('passes the supplied business unit to the caption and search context', () => {
    fixture.componentRef.setInput('businessUnitName', 'Avon and Somerset');
    fixture.detectChanges();
    const page: HTMLElement = fixture.nativeElement;

    expect(page.querySelector('.govuk-caption-l')?.textContent?.trim()).toBe('Avon and Somerset');
    expect(page.querySelector('.govuk-body-s')?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      'Searching items for Avon and Somerset',
    );

    fixture.componentRef.setInput('businessUnitName', 'West London');
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
    expect(reference.value).toBe('');
    expect(search.textContent?.trim()).toBe('Search');
    expect(search.type).toBe('button');
    expect(
      reference.compareDocumentPosition(page.querySelector('h1')!) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    reference.value = '001234';
    reference.dispatchEvent(new Event('input', { bubbles: true }));

    expect(fixture.componentInstance.referenceControl.value).toBe('001234');
  });

  it('does not invent a business-unit name before search context is connected', () => {
    const page: HTMLElement = fixture.nativeElement;

    expect(page.querySelector('.govuk-caption-l')?.textContent).toBe('');
    expect(page.querySelector('.govuk-body-s strong')?.textContent).toBe('');
  });

  it('navigates to search when the shared Back link is selected', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const page: HTMLElement = fixture.nativeElement;

    page.querySelector<HTMLAnchorElement>('opal-lib-govuk-back-link a')!.click();

    expect(navigate).toHaveBeenCalledExactlyOnceWith(['/', 'fines', 'suspense-item', 'search']);
  });
});
