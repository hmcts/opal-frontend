import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesAecStore } from '../stores/fines-aec.store';
import { FinesAecPlaceholderComponent } from './fines-aec-placeholder.component';

describe('FinesAecPlaceholderComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        FinesAecStore,
        provideRouter([
          {
            path: 'amend-values',
            component: FinesAecPlaceholderComponent,
            data: { heading: 'Amend enforcement values' },
          },
        ]),
      ],
    }).compileComponents();
  });

  it('renders the route heading and a return link retaining the selected tab', async () => {
    TestBed.inject(FinesAecStore).setActiveTab('account-types');

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/amend-values?enforcementAccountTypeId=2', FinesAecPlaceholderComponent);
    harness.detectChanges();

    expect(harness.routeNativeElement!.querySelector('h1')?.textContent).toBe('Amend enforcement values');
    expect(harness.routeNativeElement!.querySelector('#aec-placeholder-back')?.getAttribute('href')).toBe(
      '/config#account-types',
    );
    expect(harness.routeNativeElement!.textContent).toContain('This page is not yet available.');
  });
});
