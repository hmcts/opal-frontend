import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { FinesAccPartyAddAmendConvertPartyDetails } from './fines-acc-party-add-amend-convert-party-details';

describe('FinesAccPartyAddAmendConvertPartyDetails', () => {
  let component: FinesAccPartyAddAmendConvertPartyDetails;
  let fixture: ComponentFixture<FinesAccPartyAddAmendConvertPartyDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccPartyAddAmendConvertPartyDetails],
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

    fixture = TestBed.createComponent(FinesAccPartyAddAmendConvertPartyDetails);
    component = fixture.componentInstance;

    // Set required inputs
    component.form = new FormGroup({
      facc_party_add_amend_convert_organisation_name: new FormControl(''),
      facc_party_add_amend_convert_title: new FormControl(''),
      facc_party_add_amend_convert_forenames: new FormControl(''),
      facc_party_add_amend_convert_surname: new FormControl(''),
    });
    component.formControlErrorMessages = {};
    component.isCompanyPartyType = false;
    component.isIndividualPartyType = true;
    component.titleOptions = [
      { value: 'Mr', name: 'Mr' },
      { value: 'Mrs', name: 'Mrs' },
      { value: 'Miss', name: 'Miss' },
      { value: 'Ms', name: 'Ms' },
    ];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
