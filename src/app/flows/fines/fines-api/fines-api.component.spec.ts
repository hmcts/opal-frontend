import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesApiComponent } from './fines-api.component';
import { FinesApiStore } from './stores/fines-api.store';

describe('FinesApiComponent', () => {
  let component: FinesApiComponent;
  let fixture: ComponentFixture<FinesApiComponent>;
  let finesApiStore: InstanceType<typeof FinesApiStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesApiComponent],
    }).compileComponents();

    finesApiStore = TestBed.inject(FinesApiStore);
    finesApiStore.resetFinesApiState();
    fixture = TestBed.createComponent(FinesApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should allow deactivation when there are no unsaved changes', () => {
    expect(component.canDeactivate()).toBe(true);
    expect(component.handleBeforeUnload()).toBe(true);
  });

  it('should prevent deactivation when there are unsaved changes', () => {
    finesApiStore.setSelectedBusinessUnitIds([77]);

    expect(component.canDeactivate()).toBe(false);
    expect(component.handleBeforeUnload()).toBe(false);
  });
});
