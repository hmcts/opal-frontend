import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOriginatorTypeComponent } from './fines-mac-originator-type.component';
import { IFinesMacOriginatorTypeForm } from './interfaces/fines-mac-originator-type-form.interface';
import { FinesMacStoreType } from '../stores/types/fines-mac-store.type';
import { FINES_MAC_ORIGINATOR_TYPE_FORM_MOCK } from './mocks/fines-mac-originator-type-form.mock';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FINES_MAC_STATE_MOCK } from '../mocks/fines-mac-state.mock';
import { FinesMacStore } from '../stores/fines-mac.store';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths.constant';

describe('FinesMacOriginatorTypeComponent', () => {
  let component: FinesMacOriginatorTypeComponent;
  let fixture: ComponentFixture<FinesMacOriginatorTypeComponent>;
  let formSubmit: IFinesMacOriginatorTypeForm;
  let finesMacStore: FinesMacStoreType;

  beforeEach(async () => {
    formSubmit = structuredClone(FINES_MAC_ORIGINATOR_TYPE_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacOriginatorTypeComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOriginatorTypeComponent);
    component = fixture.componentInstance;

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(FINES_MAC_STATE_MOCK);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission and navigate', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component.handleOriginatorTypeSubmit(formSubmit);

    expect(finesMacStore.originatorType()).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.createAccount], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should test handleUnsavedChanges', () => {
    component.handleUnsavedChanges(true);
    expect(finesMacStore.unsavedChanges()).toBeTruthy();
    expect(component.stateUnsavedChanges).toBeTruthy();

    component.handleUnsavedChanges(false);
    expect(finesMacStore.unsavedChanges()).toBeFalsy();
    expect(component.stateUnsavedChanges).toBeFalsy();
  });
});
