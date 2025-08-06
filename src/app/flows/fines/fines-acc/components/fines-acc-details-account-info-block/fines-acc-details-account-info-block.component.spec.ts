import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccDetailsAccountInfoBlockComponent } from './fines-acc-details-account-info-block.component';
import { FINES_ACC_DEFENDANT_ACCOUNT_HEADER_MOCK } from '../../fines-acc-defendant-details/constants/fines-acc-defendant-account-header.mock';

describe('FinesAccDetailsAccountInfoBlockComponent', () => {
  let component: FinesAccDetailsAccountInfoBlockComponent;
  let fixture: ComponentFixture<FinesAccDetailsAccountInfoBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccDetailsAccountInfoBlockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDetailsAccountInfoBlockComponent);
    component = fixture.componentInstance;
    component.accountData = FINES_ACC_DEFENDANT_ACCOUNT_HEADER_MOCK;
    component.convertToMonetaryString = (value: number) => `£${value.toFixed(2)}`;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
