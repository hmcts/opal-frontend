import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { FinesMciPlaceholderComponent } from './fines-mci-placeholder.component';

describe('FinesMciPlaceholderComponent', () => {
  const render = (data: { heading: string; message?: string }): HTMLElement => {
    TestBed.configureTestingModule({
      imports: [FinesMciPlaceholderComponent],
      providers: [{ provide: ActivatedRoute, useValue: { snapshot: { data } } }],
    });
    const fixture: ComponentFixture<FinesMciPlaceholderComponent> =
      TestBed.createComponent(FinesMciPlaceholderComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  it('shows the route heading and optional message', () => {
    const page = render({ heading: 'Cancel till creation', message: 'Your till has been cancelled.' });
    expect(page.querySelector('h1')?.textContent).toBe('Cancel till creation');
    expect(page.querySelector('p')?.textContent).toBe('Your till has been cancelled.');
  });

  it('shows only the heading when the route has no message', () => {
    const page = render({ heading: 'Search for an account' });
    expect(page.querySelector('h1')?.textContent).toBe('Search for an account');
    expect(page.querySelector('p')).toBeNull();
  });
});
