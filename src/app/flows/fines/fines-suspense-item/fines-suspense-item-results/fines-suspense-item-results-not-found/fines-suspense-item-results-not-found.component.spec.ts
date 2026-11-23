import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesSuspenseItemResultsNotFoundComponent } from './fines-suspense-item-results-not-found.component';

describe('FinesSuspenseItemResultsNotFoundComponent', () => {
  let fixture: ComponentFixture<FinesSuspenseItemResultsNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesSuspenseItemResultsNotFoundComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(FinesSuspenseItemResultsNotFoundComponent);
    fixture.componentRef.setInput('businessUnitName', 'Avon and Somerset');
    fixture.detectChanges();
  });

  it('renders the business-unit caption and exact design content with one main heading', () => {
    const page: HTMLElement = fixture.nativeElement;

    expect(page.querySelector('.govuk-caption-l')?.textContent).toBe('Avon and Somerset');
    expect(page.querySelectorAll('h1')).toHaveLength(1);
    expect(page.querySelector('h1')?.textContent).toBe('Suspense item not found');
    expect(page.querySelector('p')?.textContent).toBe('This might be because:');
    expect(Array.from(page.querySelectorAll('ul.govuk-list--bullet li'), (item) => item.textContent)).toEqual([
      'the reference number was entered incorrectly',
      'the suspense item does not exist in this business unit',
    ]);
    expect(page.querySelectorAll('h2, h3, h4, h5, h6')).toHaveLength(0);
  });

  it('shows no item summary, history or management controls', () => {
    const page: HTMLElement = fixture.nativeElement;

    expect(page.querySelector('table, dl, button, a, select, input')).toBeNull();
    expect(page.textContent).not.toMatch(/History and notes|Transfer|Repay|Reverse|Add suspense note/);
  });
});
