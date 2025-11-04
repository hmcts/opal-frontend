import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { FinesAccPartyAddAmendConvertDobNi } from './fines-acc-party-add-amend-convert-dob-ni';

describe('FinesAccPartyAddAmendConvertDobNi', () => {
  let component: FinesAccPartyAddAmendConvertDobNi;
  let fixture: ComponentFixture<FinesAccPartyAddAmendConvertDobNi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccPartyAddAmendConvertDobNi],
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

    fixture = TestBed.createComponent(FinesAccPartyAddAmendConvertDobNi);
    component = fixture.componentInstance;

    // Set required inputs
    component.form = new FormGroup({
      facc_party_add_amend_convert_dob: new FormControl(''),
      facc_party_add_amend_convert_national_insurance_number: new FormControl(''),
    });
    component.formControlErrorMessages = {};

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
