import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesSuspenseItemComponent } from './fines-suspense-item.component';
import { FinesSuspenseItemStore } from './stores/fines-suspense-item.store';

describe('FinesSuspenseItemComponent', () => {
  let fixture: ComponentFixture<FinesSuspenseItemComponent>;
  let store: InstanceType<typeof FinesSuspenseItemStore>;
  const clearCache = vi.fn();

  beforeEach(async () => {
    clearCache.mockReset();
    await TestBed.configureTestingModule({
      imports: [FinesSuspenseItemComponent],
      providers: [provideRouter([]), { provide: OpalFines, useValue: { clearCache } }],
    }).compileComponents();
    fixture = TestBed.createComponent(FinesSuspenseItemComponent);
    store = TestBed.inject(FinesSuspenseItemStore);
    fixture.detectChanges();
  });

  it('requests an unload warning while the active form has unsaved changes', () => {
    const cleanEvent = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(cleanEvent);
    expect(cleanEvent.defaultPrevented).toBe(false);

    store.setUnsavedChanges(true);
    const dirtyEvent = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(dirtyEvent);
    expect(dirtyEvent.defaultPrevented).toBe(true);

    store.setUnsavedChanges(false);
    const clearedEvent = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(clearedEvent);
    expect(clearedEvent.defaultPrevented).toBe(false);
  });

  it('requests an unload warning for a retained business unit even without unsaved edits', () => {
    store.setSelectedBusinessUnit(22, 'Test business unit');
    const retainedEvent = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(retainedEvent);
    expect(retainedEvent.defaultPrevented).toBe(true);

    store.setSelectedBusinessUnit(null, null);
    const clearedEvent = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(clearedEvent);
    expect(clearedEvent.defaultPrevented).toBe(false);
  });

  it('clears journey state and caches and removes the unload listener when destroyed', () => {
    store.setSelectedBusinessUnit(22, 'Test business unit');
    store.setUnsavedChanges(true);
    fixture.destroy();

    expect(store.selectedBusinessUnitId()).toBeNull();
    expect(store.selectedBusinessUnitName()).toBeNull();
    expect(store.unsavedChanges()).toBe(false);
    expect(clearCache).toHaveBeenCalledWith('suspenseItemSummaryCache$');

    store.setUnsavedChanges(true);
    const event = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });
});
