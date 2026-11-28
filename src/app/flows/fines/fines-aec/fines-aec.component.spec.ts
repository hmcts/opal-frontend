import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_AEC_STORE_STATE } from './constants/fines-aec-store-state.constant';
import { FinesAecComponent } from './fines-aec.component';
import { FinesAecStore } from './stores/fines-aec.store';
import { getState } from '@ngrx/signals';

describe('FinesAecComponent', () => {
  let component: FinesAecComponent;
  let fixture: ComponentFixture<FinesAecComponent>;
  let store: InstanceType<typeof FinesAecStore>;
  let clearCache: ReturnType<typeof vi.fn>;
  let resetBannerError: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    clearCache = vi.fn();
    resetBannerError = vi.fn();
    await TestBed.configureTestingModule({
      imports: [FinesAecComponent],
      providers: [
        provideRouter([]),
        FinesAecStore,
        { provide: OpalFines, useValue: { clearCache } },
        { provide: GlobalStore, useValue: { resetBannerError } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAecComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(FinesAecStore);
  });

  it('allows the page to unload when no routed form has unsaved changes', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('router-outlet')).not.toBeNull();
    expect(component.handleBeforeUnload()).toBe(true);
  });

  it('clears configuration state, cached thresholds and request banners when leaving the flow', () => {
    store.setActiveTab('enforcement-paths');
    store.setSuccessMessage('Enforcement values updated');
    fixture.detectChanges();

    fixture.destroy();

    expect(getState(store)).toEqual(FINES_AEC_STORE_STATE);
    expect(clearCache).toHaveBeenCalledExactlyOnceWith('enforcementAccountTypesCache$');
    expect(resetBannerError).toHaveBeenCalledOnce();
  });
});
