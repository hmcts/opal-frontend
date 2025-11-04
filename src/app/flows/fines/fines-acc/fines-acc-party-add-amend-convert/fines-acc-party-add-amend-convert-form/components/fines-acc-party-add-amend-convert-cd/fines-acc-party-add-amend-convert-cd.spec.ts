import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { FinesAccPartyAddAmendConvertCd } from './fines-acc-party-add-amend-convert-cd';

describe('FinesAccPartyAddAmendConvertCd', () => {
  let component: FinesAccPartyAddAmendConvertCd;
  let fixture: ComponentFixture<FinesAccPartyAddAmendConvertCd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccPartyAddAmendConvertCd],
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

    fixture = TestBed.createComponent(FinesAccPartyAddAmendConvertCd);
    component = fixture.componentInstance;

    // Set required inputs
    component.form = new FormGroup({
      facc_party_add_amend_convert_contact_email_address_1: new FormControl(''),
      facc_party_add_amend_convert_contact_email_address_2: new FormControl(''),
      facc_party_add_amend_convert_contact_telephone_number_mobile: new FormControl(''),
      facc_party_add_amend_convert_contact_telephone_number_home: new FormControl(''),
      facc_party_add_amend_convert_contact_telephone_number_business: new FormControl(''),
    });
    component.formControlErrorMessages = {};

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
