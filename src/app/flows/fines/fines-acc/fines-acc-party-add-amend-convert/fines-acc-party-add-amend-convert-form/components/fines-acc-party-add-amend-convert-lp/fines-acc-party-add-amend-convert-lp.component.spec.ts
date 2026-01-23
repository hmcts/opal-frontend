import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { FinesAccPartyAddAmendConvertLp } from './fines-acc-party-add-amend-convert-lp.component';
import { GovukRadioComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';

describe('FinesAccPartyAddAmendConvertLp', () => {
  let component: FinesAccPartyAddAmendConvertLp;
  let fixture: ComponentFixture<FinesAccPartyAddAmendConvertLp>;
  let originalInitOuterRadios: () => void;

  beforeAll(() => {
    originalInitOuterRadios = GovukRadioComponent.prototype['initOuterRadios'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(GovukRadioComponent.prototype, 'initOuterRadios').and.stub();
  });

  afterAll(() => {
    GovukRadioComponent.prototype['initOuterRadios'] = originalInitOuterRadios;
  });

  beforeEach(() => {
    document.body.classList.add('govuk-frontend-supported', 'js-enabled');
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccPartyAddAmendConvertLp],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {},
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccPartyAddAmendConvertLp);
    component = fixture.componentInstance;

    // Set required inputs
    component.form = new FormGroup({
      facc_party_add_amend_convert_language_preferences_document_language: new FormControl(''),
      facc_party_add_amend_convert_language_preferences_hearing_language: new FormControl(''),
    });
    component.formControlErrorMessages = {};
    component.languageOptions = [
      { key: 'en', value: 'English' },
      { key: 'cy', value: 'Welsh' },
    ];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
