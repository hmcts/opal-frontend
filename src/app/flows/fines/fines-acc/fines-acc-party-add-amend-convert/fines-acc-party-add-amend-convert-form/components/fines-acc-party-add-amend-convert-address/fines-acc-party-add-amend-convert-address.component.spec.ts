import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { FinesAccPartyAddAmendConvertAddress } from './fines-acc-party-add-amend-convert-address.component';

describe('FinesAccPartyAddAmendConvertAddress', () => {
  let component: FinesAccPartyAddAmendConvertAddress;
  let fixture: ComponentFixture<FinesAccPartyAddAmendConvertAddress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccPartyAddAmendConvertAddress],
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

    fixture = TestBed.createComponent(FinesAccPartyAddAmendConvertAddress);
    component = fixture.componentInstance;

    component.form = new FormGroup({
      facc_party_add_amend_convert_address_line_1: new FormControl(''),
      facc_party_add_amend_convert_address_line_2: new FormControl(''),
      facc_party_add_amend_convert_address_line_3: new FormControl(''),
      facc_party_add_amend_convert_post_code: new FormControl(''),
    });
    component.formControlErrorMessages = {};

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
