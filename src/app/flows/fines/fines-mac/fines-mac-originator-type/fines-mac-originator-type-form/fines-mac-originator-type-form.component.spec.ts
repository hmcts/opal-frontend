import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOriginatorTypeFormComponent } from './fines-mac-originator-type-form.component';
import { IFinesMacOriginatorTypeForm } from '../interfaces/fines-mac-originator-type-form.interface';
import { FinesMacStoreType } from '../../stores/types/fines-mac-store.type';
import { FINES_MAC_ORIGINATOR_TYPE_FORM_MOCK } from '../mocks/fines-mac-originator-type-form.mock';
import { of } from 'rxjs';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { FINES_MAC_STATE_MOCK } from '../../mocks/fines-mac-state.mock';
import { ActivatedRoute } from '@angular/router';
import { GovukRadioComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';

describe('FinesMacOriginatorTypeFormComponent', () => {
  let component: FinesMacOriginatorTypeFormComponent;
  let fixture: ComponentFixture<FinesMacOriginatorTypeFormComponent>;
  let formSubmit: IFinesMacOriginatorTypeForm;
  let finesMacStore: FinesMacStoreType;
  let originalInitOuterRadios: () => void;

  beforeAll(() => {
    originalInitOuterRadios = GovukRadioComponent.prototype['initOuterRadios'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(GovukRadioComponent.prototype, 'initOuterRadios').and.stub();
  });

  afterAll(() => {
    GovukRadioComponent.prototype['initOuterRadios'] = originalInitOuterRadios;
  });

  beforeEach(async () => {
    // Prevent GOV.UK Frontend SupportError logs during Karma runs.
    document.body.classList.add('govuk-frontend-supported', 'js-enabled');
    formSubmit = structuredClone(FINES_MAC_ORIGINATOR_TYPE_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacOriginatorTypeFormComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOriginatorTypeFormComponent);
    component = fixture.componentInstance;

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(FINES_MAC_STATE_MOCK);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit form submit event with form value', () => {
    spyOn(component['formSubmit'], 'emit');
    const event = {} as SubmitEvent;

    component['rePopulateForm'](formSubmit.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        formData: formSubmit.formData,
        nestedFlow: false,
      }),
    );
  });

  it('should call initialOriginatorTypeSetup method', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupOriginatorTypeForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setInitialErrorMessages');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'rePopulateForm');

    component['initialOriginatorTypeSetup']();

    expect(component['setupOriginatorTypeForm']).toHaveBeenCalled();
    expect(component['setInitialErrorMessages']).toHaveBeenCalled();
    expect(component['rePopulateForm']).toHaveBeenCalledWith(finesMacStore.originatorType().formData);
  });
});
