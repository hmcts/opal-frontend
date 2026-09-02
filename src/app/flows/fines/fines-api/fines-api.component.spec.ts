import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterOutlet } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesApiComponent } from './fines-api.component';
import { FinesApiStore } from './stores/fines-api.store';

describe('FinesApiComponent', () => {
  let component: FinesApiComponent;
  let fixture: ComponentFixture<FinesApiComponent>;
  let finesApiStore: InstanceType<typeof FinesApiStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesApiComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    finesApiStore = TestBed.inject(FinesApiStore);
    finesApiStore.resetFinesApiState();
    fixture = TestBed.createComponent(FinesApiComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should render the child route outlet', () => {
    fixture.detectChanges();

    const routerOutlet = fixture.debugElement.query(By.directive(RouterOutlet));

    expect(routerOutlet).toBeTruthy();
  });

  it('should allow deactivation when there are no unsaved changes in the store', () => {
    expect(component.canDeactivate()).toBe(true);
  });

  it('should allow browser unload when there are no unsaved changes in the store', () => {
    expect(component.handleBeforeUnload()).toBe(true);
  });

  it('should prevent deactivation when the store has unsaved changes', () => {
    finesApiStore.setSelectedBusinessUnitIds([77]);

    expect(component.canDeactivate()).toBe(false);
  });

  it('should prevent browser unload when the store has unsaved changes', () => {
    finesApiStore.setSelectedBusinessUnitIds([77]);

    expect(component.handleBeforeUnload()).toBe(false);
  });

  it('should allow deactivation again after unsaved changes are cleared', () => {
    finesApiStore.setSelectedBusinessUnitIds([77]);
    finesApiStore.clearSelectedBusinessUnitIds();

    expect(component.canDeactivate()).toBe(true);
    expect(component.handleBeforeUnload()).toBe(true);
  });

  it('should invoke the beforeunload host listener when the window event fires', () => {
    fixture.detectChanges();
    const handleBeforeUnloadSpy = vi.spyOn(component, 'handleBeforeUnload');

    window.dispatchEvent(new Event('beforeunload'));

    expect(handleBeforeUnloadSpy).toHaveBeenCalled();
  });
});
