import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { finesAccAprAddChangeTitleResolver } from './fines-acc-apr-add-change-title.resolver';

@Component({ template: '' })
class TitleResolverTestPage {}

describe('finesAccAprAddChangeTitleResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: ':mode', component: TitleResolverTestPage, title: finesAccAprAddChangeTitleResolver }]),
      ],
    });
  });

  it.each([
    ['add', 'OPAL - Add Alternate Payment Reference'],
    ['change', 'OPAL - Change Alternate Payment Reference'],
  ])('sets the document title for mode %s', async (mode, expectedTitle) => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl(`/${mode}`);

    expect(TestBed.inject(Title).getTitle()).toBe(expectedTitle);
  });

  it('updates the document title when the shared route component is reused for another mode', async () => {
    const harness = await RouterTestingHarness.create();
    const addPage = await harness.navigateByUrl('/add', TitleResolverTestPage);

    const changePage = await harness.navigateByUrl('/change', TitleResolverTestPage);

    expect(changePage).toBe(addPage);
    expect(TestBed.inject(Title).getTitle()).toBe('OPAL - Change Alternate Payment Reference');
  });
});
