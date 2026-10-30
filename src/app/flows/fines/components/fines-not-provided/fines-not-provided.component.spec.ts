import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';

import { FinesNotProvidedComponent } from './fines-not-provided.component';
import { beforeEach, describe, expect, it } from 'vitest';
import { RELEASE_1A_1_2_FEATURE_FLAG } from '../../constants/release-feature-flags.constant';

describe('FinesNotProvidedComponent', () => {
  let component: FinesNotProvidedComponent;
  let fixture: ComponentFixture<FinesNotProvidedComponent>;
  let globalStore: InstanceType<typeof GlobalStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesNotProvidedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesNotProvidedComponent);
    component = fixture.componentInstance;
    globalStore = TestBed.inject(GlobalStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display an em dash and announce no data to screen readers', () => {
    globalStore.setFeatureFlags({ [RELEASE_1A_1_2_FEATURE_FLAG]: true });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[aria-hidden="true"]').textContent.trim()).toBe('—');
    expect(fixture.nativeElement.querySelector('.govuk-visually-hidden').textContent.trim()).toBe('No data');
  });

  it('should use an aria label when release-1a-1-2 is disabled', () => {
    globalStore.setFeatureFlags({ [RELEASE_1A_1_2_FEATURE_FLAG]: false });
    fixture.detectChanges();

    const notProvided = fixture.nativeElement.querySelector('p');

    expect(notProvided.getAttribute('aria-label')).toBe('No data');
    expect(notProvided.querySelector('[aria-hidden="true"]')).toBeNull();
    expect(notProvided.querySelector('.govuk-visually-hidden')).toBeNull();
  });
});
