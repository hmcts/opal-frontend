import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { describe, expect, it } from 'vitest';
import { FinesMciComponent } from './fines-mci.component';
import { FinesMciStore } from './stores/fines-mci.store';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';

@Component({ template: '' })
class EditedFormComponent extends AbstractFormParentBaseComponent {
  public override stateUnsavedChanges = true;
}

describe('FinesMciComponent', () => {
  it('allows unload when there are no edits or in-memory MCI data', () => {
    TestBed.configureTestingModule({ imports: [FinesMciComponent], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(FinesMciComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.handleBeforeUnload()).toBe(true);
  });

  it('warns on browser unload when the till is stored in memory', () => {
    TestBed.configureTestingModule({ imports: [FinesMciComponent], providers: [provideRouter([])] });
    const store = TestBed.inject(FinesMciStore);
    store.setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    store.ensureTill();
    const fixture = TestBed.createComponent(FinesMciComponent);
    fixture.detectChanges();
    const event = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    store.reset();
    expect(fixture.componentInstance.handleBeforeUnload()).toBe(true);
  });

  it('warns when the routed form has unsaved edits even without stored data', async () => {
    TestBed.configureTestingModule({
      imports: [FinesMciComponent, EditedFormComponent],
      providers: [
        provideRouter([
          { path: 'mci', component: FinesMciComponent, children: [{ path: 'form', component: EditedFormComponent }] },
        ]),
      ],
    });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/mci/form', FinesMciComponent);
    const event = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });
});
