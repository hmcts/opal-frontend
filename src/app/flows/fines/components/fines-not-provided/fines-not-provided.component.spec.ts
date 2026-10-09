import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesNotProvidedComponent } from './fines-not-provided.component';
import { beforeEach, describe, expect, it } from 'vitest';

describe('FinesNotProvidedComponent', () => {
  let component: FinesNotProvidedComponent;
  let fixture: ComponentFixture<FinesNotProvidedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesNotProvidedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesNotProvidedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display an em dash and announce no data to screen readers', () => {
    expect(fixture.nativeElement.querySelector('[aria-hidden="true"]').textContent.trim()).toBe('—');
    expect(fixture.nativeElement.querySelector('.govuk-visually-hidden').textContent.trim()).toBe('No data');
  });
});
