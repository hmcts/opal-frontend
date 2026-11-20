import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterOutlet } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesFpuComponent } from './fines-fpu.component';
import { FinesFpuStore } from './stores/fines-fpu.store';

describe('FinesFpuComponent', () => {
  let fixture: ComponentFixture<FinesFpuComponent>;
  let component: FinesFpuComponent;
  let store: InstanceType<typeof FinesFpuStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesFpuComponent],
      providers: [provideRouter([])],
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

  it('should reset the journey state when the shell is destroyed', () => {
    store.setUnsavedChanges(true);

    fixture.destroy();

    expect(store.unsavedChanges()).toBe(false);
  });
});
