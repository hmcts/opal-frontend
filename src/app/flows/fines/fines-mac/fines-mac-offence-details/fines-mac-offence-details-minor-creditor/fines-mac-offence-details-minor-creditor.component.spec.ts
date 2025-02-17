import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsMinorCreditorComponent } from './fines-mac-offence-details-minor-creditor.component';
import { FINES_MAC_STATE_MOCK } from '../../mocks/fines-mac-state.mock';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { IFinesMacOffenceDetailsMinorCreditorForm } from './interfaces/fines-mac-offence-details-minor-creditor-form.interface';
import { FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK } from './mocks/fines-mac-offence-details-minor-creditor-form.mock';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../routing/constants/fines-mac-offence-details-routing-paths.constant';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE } from '../constants/fines-mac-offence-details-draft-state.constant';
import { FinesMacStoreType } from '../../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { FinesMacOffenceDetailsStoreType } from '../stores/types/fines-mac-offence-details.type';
import { FinesMacOffenceDetailsStore } from '../stores/fines-mac-offence-details.store';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK } from '../mocks/fines-mac-offence-details-draft-state.mock';
import { FINES_MAC_OFFENCE_DETAILS_FORM_MOCK } from '../mocks/fines-mac-offence-details-form.mock';

describe('FinesMacOffenceDetailsMinorCreditorComponent', () => {
  let component: FinesMacOffenceDetailsMinorCreditorComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsMinorCreditorComponent>;
  let formSubmit: IFinesMacOffenceDetailsMinorCreditorForm;
  let finesMacStore: FinesMacStoreType;
  let finesMacOffenceDetailsStore: FinesMacOffenceDetailsStoreType;

  beforeEach(async () => {
    formSubmit = structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsMinorCreditorComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('offence-details'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsMinorCreditorComponent);
    component = fixture.componentInstance;

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(FINES_MAC_STATE_MOCK);

    finesMacOffenceDetailsStore = TestBed.inject(FinesMacOffenceDetailsStore);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission when editing and navigate to add an offence', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    finesMacState.offenceDetails = [];
    finesMacStore.setFinesMacStore(finesMacState);
    formSubmit.nestedFlow = false;

    const offenceWithMinorCreditor = structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK);
    offenceWithMinorCreditor.childFormData = [structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK)];

    finesMacOffenceDetailsStore.setOffenceDetailsDraft([offenceWithMinorCreditor]);
    finesMacOffenceDetailsStore.setRemoveMinorCreditor(0);

    component.handleMinorCreditorFormSubmit(formSubmit);
    fixture.detectChanges();

    expect(finesMacOffenceDetailsStore.offenceDetailsDraft()[0].childFormData!.length).toEqual(1);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addOffence], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission when editing and navigate to add an offence multiple childFormData', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    finesMacState.offenceDetails = [];
    finesMacStore.setFinesMacStore(finesMacState);
    formSubmit.nestedFlow = false;

    const offenceWithMinorCreditor = structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK);
    offenceWithMinorCreditor.childFormData = [
      {
        ...structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK),
        formData: {
          ...structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK.formData),
          fm_offence_details_imposition_position: 1,
        },
      },
    ];
    finesMacOffenceDetailsStore.setOffenceDetailsDraft([offenceWithMinorCreditor]);
    finesMacOffenceDetailsStore.setRemoveMinorCreditor(0);

    component.handleMinorCreditorFormSubmit(formSubmit);
    fixture.detectChanges();

    expect(finesMacOffenceDetailsStore.offenceDetailsDraft()[0].childFormData!.length).toEqual(2);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addOffence], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate to add an offence', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    finesMacState.offenceDetails = [];
    finesMacStore.setFinesMacStore(finesMacState);
    formSubmit.nestedFlow = false;

    finesMacOffenceDetailsStore.setOffenceDetailsDraft(FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK.offenceDetailsDraft);
    finesMacOffenceDetailsStore.setRowIndex(0);
    finesMacOffenceDetailsStore.setRemoveMinorCreditor(FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE.removeMinorCreditor);

    component.handleMinorCreditorFormSubmit(formSubmit);
    fixture.detectChanges();

    expect(finesMacOffenceDetailsStore.offenceDetailsDraft().length).toEqual(1);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addOffence], {
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
