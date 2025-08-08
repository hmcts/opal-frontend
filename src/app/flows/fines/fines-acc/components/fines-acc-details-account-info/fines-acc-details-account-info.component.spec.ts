import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccDetailsAccountInfoComponent } from './fines-acc-details-account-info.component';
import { FINES_ACC_DEFENDANT_ACCOUNT_HEADER_MOCK } from '../../fines-acc-defendant-details/mocks/fines-acc-defendant-account-header.mock';

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
