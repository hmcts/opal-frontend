import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { FinesMciPlaceholderComponent } from './fines-mci-placeholder.component';

describe('FinesMciPlaceholderComponent', () => {
  const render = (message?: string) => {
    TestBed.configureTestingModule({
      imports: [FinesMciPlaceholderComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { data: { heading: 'Payment details', message } } } },
      ],
    });
    const fixture = TestBed.createComponent(FinesMciPlaceholderComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  it('renders the heading and optional message from the route', () => {
    const element = render('Example placeholder message');
    expect(element.querySelector('h1')?.textContent?.trim()).toBe('Payment details');
    expect(element.querySelector('p.govuk-body')?.textContent?.trim()).toBe('Example placeholder message');
  });

  it.each([undefined, ''])('renders the heading without a message paragraph when the message is %s', (message) => {
    const element = render(message);
    expect(element.querySelector('h1')?.textContent?.trim()).toBe('Payment details');
    expect(element.querySelector('p')).toBeNull();
  });
});
