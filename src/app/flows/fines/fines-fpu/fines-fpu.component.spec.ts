import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterOutlet } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesFpuComponent } from './fines-fpu.component';
import { FinesFpuStore } from './stores/fines-fpu.store';

describe('FinesFpuComponent', () => {
  let fixture: ComponentFixture<FinesFpuComponent>;
  let component: FinesFpuComponent;
  let store: InstanceType<typeof FinesFpuStore>;
  let opalFines: { clearDraftAccountsCache: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    opalFines = { clearDraftAccountsCache: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [FinesFpuComponent],
      providers: [provideRouter([]), { provide: OpalFines, useValue: opalFines }],
    }).compileComponents();

    store = TestBed.inject(FinesFpuStore);
    fixture = TestBed.createComponent(FinesFpuComponent);
    component = fixture.componentInstance;
  });

  it('should render the child route outlet', () => {
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.directive(RouterOutlet))).toBeTruthy();
  });

  it('should allow navigation and browser unload for the unchanged placeholder', () => {
    expect(store.unsavedChanges()).toBe(false);
    expect(component.canDeactivate()).toBe(true);
    expect(component.handleBeforeUnload()).toBe(true);
  });

  it('should prevent navigation and browser unload while the journey has unsaved changes', () => {
    store.setUnsavedChanges(true);

    expect(component.canDeactivate()).toBe(false);
    expect(component.handleBeforeUnload()).toBe(false);
  });

  it('should allow navigation again when unsaved changes are cleared', () => {
    store.setUnsavedChanges(true);
    store.setUnsavedChanges(false);

    expect(component.canDeactivate()).toBe(true);
    expect(component.handleBeforeUnload()).toBe(true);
  });

  it('should register the browser unload listener', () => {
    fixture.detectChanges();
    const beforeUnload = vi.spyOn(component, 'handleBeforeUnload');

    window.dispatchEvent(new Event('beforeunload'));

    expect(beforeUnload).toHaveBeenCalledOnce();
  });

  it('should reset the journey state and clear cached draft accounts when the shell is destroyed', () => {
    store.setFragment('published');
    store.setBusinessUnits([{ business_unit_id: 78, business_unit_name: 'Eastshire', ticket_count: 2 }]);
    store.setSelectedBusinessUnitIds([78]);
    store.setUnsavedChanges(true);

    fixture.destroy();

    expect(store.fragment()).toBe('to-publish');
    expect(store.tabData()).toBeNull();
    expect(store.businessUnits()).toEqual([]);
    expect(store.selectedBusinessUnitIds()).toEqual([]);
    expect(store.unsavedChanges()).toBe(false);
    expect(opalFines.clearDraftAccountsCache).toHaveBeenCalledOnce();
  });
});
