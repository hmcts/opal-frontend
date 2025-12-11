import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { FinesAccPartyAddAmendConvertLp } from './fines-acc-party-add-amend-convert-lp.component';

describe('FinesAccPartyAddAmendConvertLp', () => {
  let component: FinesAccPartyAddAmendConvertLp;
  let fixture: ComponentFixture<FinesAccPartyAddAmendConvertLp>;

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
