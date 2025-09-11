import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacEmployerDetailsComponent } from './fines-mac-employer-details.component';
import { IFinesMacEmployerDetailsForm } from './interfaces/fines-mac-employer-details-form.interface';
import { FINES_MAC_STATE_MOCK } from '../mocks/fines-mac-state.mock';
import { FINES_MAC_EMPLOYER_DETAILS_FORM_MOCK } from './mocks/fines-mac-employer-details-form.mock';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths.constant';
import { FinesMacStoreType } from '../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../stores/fines-mac.store';
import { FINES_MAC_DEFENDANT_TYPES_KEYS } from '../constants/fines-mac-defendant-types-keys';

describe('FinesMacEmployerDetailsComponent', () => {
  let component: FinesMacEmployerDetailsComponent;
  let fixture: ComponentFixture<FinesMacEmployerDetailsComponent>;
  let formSubmit: IFinesMacEmployerDetailsForm;
  let finesMacStore: FinesMacStoreType;

  beforeEach(async () => {
    formSubmit = structuredClone(FINES_MAC_EMPLOYER_DETAILS_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacEmployerDetailsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacEmployerDetailsComponent);
    component = fixture.componentInstance;

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(FINES_MAC_STATE_MOCK);

    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission and navigate to account details', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.nestedFlow = false;

    component.handleEmployerDetailsSubmit(formSubmit);

    expect(finesMacStore.employerDetails()).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.accountDetails], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate to offence details - adult or youth only', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.nestedFlow = true;

    component.handleEmployerDetailsSubmit(formSubmit);

    expect(finesMacStore.employerDetails()).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.offenceDetails], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate to personal details - parent or guardian to pay', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.pgToPay;
    formSubmit.nestedFlow = true;

    component.handleEmployerDetailsSubmit(formSubmit);

    expect(finesMacStore.employerDetails()).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.personalDetails], {
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
