import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FinesAccDebtorAddAmend } from './fines-acc-debtor-add-amend.component';
import { MOCK_EMPTY_FINES_ACC_DEBTOR_ADD_AMEND_FORM_DATA } from './mocks/fines-acc-debtor-add-amend-form.mock';

describe('FinesAccDebtorAddAmend', () => {
  let component: FinesAccDebtorAddAmend;
  let fixture: ComponentFixture<FinesAccDebtorAddAmend>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccDebtorAddAmend],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                defendantAccountDefendantTabData: MOCK_EMPTY_FINES_ACC_DEBTOR_ADD_AMEND_FORM_DATA,
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDebtorAddAmend);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
