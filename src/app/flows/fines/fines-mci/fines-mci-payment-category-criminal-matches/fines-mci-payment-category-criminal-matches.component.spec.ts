import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { BehaviorSubject, map } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesMciPaymentCategoryCriminalMatchesComponent } from './fines-mci-payment-category-criminal-matches.component';

describe('FinesMciPaymentCategoryCriminalMatchesComponent', () => {
  let fixture: ComponentFixture<FinesMciPaymentCategoryCriminalMatchesComponent>;
  let queryParamSubject: BehaviorSubject<Record<string, string>>;

  beforeEach(async () => {
    queryParamSubject = new BehaviorSubject<Record<string, string>>({ results: 'matches' });

    await TestBed.configureTestingModule({
      imports: [FinesMciPaymentCategoryCriminalMatchesComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: queryParamSubject.pipe(map((queryParams) => convertToParamMap(queryParams))),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMciPaymentCategoryCriminalMatchesComponent);
    fixture.detectChanges();
  });

  it.each([
    ['matches', 'Matching criminal accounts', 'PO-3480'],
    ['no-matches', 'No matching criminal accounts', 'PO-3528'],
    ['too-many', 'More than 100 matching criminal accounts', 'PO-3528'],
    ['search-criteria-cannot-be-combined', 'Search criteria cannot be combined', 'PO-3529'],
  ])('should render placeholder content for %s', (results, heading, ticket) => {
    queryParamSubject.next({ results });
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Avon and Somerset');
    expect(text).toContain(heading);
    expect(text).toContain(ticket);
  });

  it('should render the matching results placeholder by default', () => {
    queryParamSubject.next({ results: 'unknown' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Matching criminal accounts');
    expect(fixture.nativeElement.textContent).toContain('PO-3480');
  });
});
