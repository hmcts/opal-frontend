import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesConComponent } from './fines-con.component';
import { FinesConStore } from './stores/fines-con.store';
import { FinesConStoreType } from './stores/types/fines-con-store.type';
import { FINES_CON_SELECT_BU_FORM } from './select-business-unit/fines-con-select-bu/constants/fines-con-select-bu-form.constant';
import { FINES_CON_SELECT_BU_FORM_COMPANY_MOCK } from './select-business-unit/fines-con-select-bu/mocks/fines-con-select-bu-form-company.mock';

describe('FinesConComponent', () => {
  let component: FinesConComponent;
  let fixture: ComponentFixture<FinesConComponent>;
  let finesConStore: InstanceType<FinesConStoreType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesConComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesConComponent);
    component = fixture.componentInstance;
    finesConStore = TestBed.inject(FinesConStore);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset consolidation state on destroy', () => {
    finesConStore.updateSelectBuFormComplete(FINES_CON_SELECT_BU_FORM_COMPANY_MOCK);
    finesConStore.setStateChanges(true);
    finesConStore.setUnsavedChanges(true);

    const destroySpy = vi.spyOn(component, 'ngOnDestroy');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(finesConStore.selectBuForm()).toEqual(FINES_CON_SELECT_BU_FORM);
    expect(finesConStore.stateChanges()).toBe(false);
    expect(finesConStore.unsavedChanges()).toBe(false);
  });
});
