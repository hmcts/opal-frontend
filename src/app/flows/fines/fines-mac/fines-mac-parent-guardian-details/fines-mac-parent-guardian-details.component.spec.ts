import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacParentGuardianDetailsComponent } from './fines-mac-parent-guardian-details.component';
import { IFinesMacParentGuardianDetailsForm } from './interfaces/fines-mac-parent-guardian-details-form.interface';
import { FINES_MAC_STATE_MOCK } from '../mocks/fines-mac-state.mock';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_FORM_MOCK } from './mocks/fines-mac-parent-guardian-details-form.mock';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths.constant';
import { FinesMacStoreType } from '../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../stores/fines-mac.store';
import { FINES_MAC_DEFENDANT_TYPES_KEYS } from '../constants/fines-mac-defendant-types-keys';

describe('FinesMacParentGuardianDetailsComponent', () => {
  let component: FinesMacParentGuardianDetailsComponent;
  let fixture: ComponentFixture<FinesMacParentGuardianDetailsComponent>;
  let formSubmit: IFinesMacParentGuardianDetailsForm;
  let finesMacStore: FinesMacStoreType;

  beforeEach(async () => {
    formSubmit = structuredClone(FINES_MAC_PARENT_GUARDIAN_DETAILS_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacParentGuardianDetailsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacParentGuardianDetailsComponent);
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

    formSubmit.nestedFlow = false;
    component.handleParentGuardianDetailsSubmit(formSubmit);

    expect(finesMacStore.parentGuardianDetails()).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.accountDetails], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.pgToPay;

    formSubmit.nestedFlow = true;
    component.handleParentGuardianDetailsSubmit(formSubmit);

    expect(finesMacStore.parentGuardianDetails()).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.contactDetails], {
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
