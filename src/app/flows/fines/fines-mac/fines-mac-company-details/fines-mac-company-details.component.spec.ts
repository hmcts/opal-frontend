import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacCompanyDetailsComponent } from './fines-mac-company-details.component';
import { IFinesMacCompanyDetailsForm } from './interfaces/fines-mac-company-details-form.interface';
import { FINES_MAC_STATE_MOCK } from '../mocks/fines-mac-state.mock';
import { FINES_MAC_COMPANY_DETAILS_FORM_MOCK } from './mocks/fines-mac-company-details-form.mock';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths.constant';
import { FinesMacStoreType } from '../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../stores/fines-mac.store';
import { FINES_MAC_DEFENDANT_TYPES_KEYS } from '../constants/fines-mac-defendant-types-keys';

describe('FinesMacCompanyDetailsComponent', () => {
  let component: FinesMacCompanyDetailsComponent;
  let fixture: ComponentFixture<FinesMacCompanyDetailsComponent>;
  let formSubmit: IFinesMacCompanyDetailsForm;
  let finesMacStore: FinesMacStoreType;

  beforeEach(async () => {
    formSubmit = structuredClone(FINES_MAC_COMPANY_DETAILS_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacCompanyDetailsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacCompanyDetailsComponent);
    component = fixture.componentInstance;

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(FINES_MAC_STATE_MOCK);

    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.company;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission and navigate to account details', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.nestedFlow = false;

    component.handleCompanyDetailsSubmit(formSubmit);

    expect(finesMacStore.companyDetails()).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.accountDetails], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate next route', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.nestedFlow = true;

    component.handleCompanyDetailsSubmit(formSubmit);

    expect(finesMacStore.companyDetails()).toEqual(formSubmit);
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
