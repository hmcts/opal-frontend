import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { FinesAccPartyAddAmendConvertEd } from './fines-acc-party-add-amend-convert-ed';

describe('FinesAccPartyAddAmendConvertEd', () => {
  let component: FinesAccPartyAddAmendConvertEd;
  let fixture: ComponentFixture<FinesAccPartyAddAmendConvertEd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccPartyAddAmendConvertEd],
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

    fixture = TestBed.createComponent(FinesAccPartyAddAmendConvertEd);
    component = fixture.componentInstance;

    // Set required inputs
    component.form = new FormGroup({
      facc_party_add_amend_convert_employer_company_name: new FormControl(''),
      facc_party_add_amend_convert_employer_reference: new FormControl(''),
      facc_party_add_amend_convert_employer_email_address: new FormControl(''),
      facc_party_add_amend_convert_employer_telephone_number: new FormControl(''),
      facc_party_add_amend_convert_employer_address_line_1: new FormControl(''),
      facc_party_add_amend_convert_employer_address_line_2: new FormControl(''),
      facc_party_add_amend_convert_employer_address_line_3: new FormControl(''),
      facc_party_add_amend_convert_employer_address_line_4: new FormControl(''),
      facc_party_add_amend_convert_employer_address_line_5: new FormControl(''),
      facc_party_add_amend_convert_employer_post_code: new FormControl(''),
    });
    component.formControlErrorMessages = {};

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
