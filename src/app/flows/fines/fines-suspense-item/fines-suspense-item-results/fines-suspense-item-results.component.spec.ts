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

  it('renders the results heading in the journey content column', () => {
    const page: HTMLElement = fixture.nativeElement;

    expect(page.querySelectorAll('h1')).toHaveLength(1);
    expect(page.querySelector('.govuk-grid-column-two-thirds h1')?.textContent).toBe('Suspense item results');
  });

  it('navigates to search when the shared Back link is selected', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const page: HTMLElement = fixture.nativeElement;

    page.querySelector<HTMLAnchorElement>('opal-lib-govuk-back-link a')!.click();

    expect(navigate).toHaveBeenCalledExactlyOnceWith(['/', 'fines', 'suspense-item', 'search']);
  });
});
