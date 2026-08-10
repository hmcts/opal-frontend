import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesAccessibleMonetaryComponent } from './fines-accessible-monetary.component';

describe('FinesAccessibleMonetaryComponent', () => {
  let fixture: ComponentFixture<FinesAccessibleMonetaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccessibleMonetaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccessibleMonetaryComponent);
  });

  it('should render a positive amount without additional accessibility markup', () => {
    fixture.componentRef.setInput('value', 17);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent.trim()).toBe('£17.00');
    expect(fixture.nativeElement.querySelector('[aria-hidden="true"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('.govuk-visually-hidden')).toBeNull();
  });

  it('should render a visible negative amount with hidden minus text for assistive technology', () => {
    fixture.componentRef.setInput('value', -17);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[aria-hidden="true"]')?.textContent.trim()).toBe('-£17.00');
    expect(fixture.nativeElement.querySelector('.govuk-visually-hidden')?.textContent.trim()).toBe('minus £17.00');
  });

  it('should not expose minus text when the minus sign is intentionally removed', () => {
    fixture.componentRef.setInput('value', -17);
    fixture.componentRef.setInput('format', 'remove-minus-symbol');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent.trim()).toBe('£17.00');
    expect(fixture.nativeElement.querySelector('[aria-hidden="true"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('.govuk-visually-hidden')).toBeNull();
  });

  it('should support preformatted negative monetary strings', () => {
    fixture.componentRef.setInput('value', '-£3.00');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[aria-hidden="true"]')?.textContent.trim()).toBe('-£3.00');
    expect(fixture.nativeElement.querySelector('.govuk-visually-hidden')?.textContent.trim()).toBe('minus £3.00');
  });
});
