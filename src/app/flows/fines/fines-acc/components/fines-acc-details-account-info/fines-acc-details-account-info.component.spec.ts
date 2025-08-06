import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccDetailsAccountInfoComponent } from './fines-acc-details-account-info.component';
import { FINES_ACC_DEFENDANT_ACCOUNT_HEADER_MOCK } from '../../fines-acc-defendant-details/constants/fines-acc-defendant-account-header.mock';
import { OPAL_FINES_BUSINESS_UNIT_NON_SNAKE_CASE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-non-snake-case.mock';

describe('FinesAccDetailsAccountInfoComponent', () => {
  let component: FinesAccDetailsAccountInfoComponent;
  let fixture: ComponentFixture<FinesAccDetailsAccountInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccDetailsAccountInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDetailsAccountInfoComponent);
    component = fixture.componentInstance;
    component.accountData = FINES_ACC_DEFENDANT_ACCOUNT_HEADER_MOCK;
    component.businessUnit = OPAL_FINES_BUSINESS_UNIT_NON_SNAKE_CASE_MOCK;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
