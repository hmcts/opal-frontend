import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccDetailsAccountHeadingComponent } from './fines-acc-details-account-heading.component';
import { FINES_ACC_DEFENDANT_ACCOUNT_HEADER_MOCK } from '../../fines-acc-defendant-details/constants/fines-acc-defendant-account-header.mock';

describe('FinesAccDetailsAccountHeadingComponent', () => {
  let component: FinesAccDetailsAccountHeadingComponent;
  let fixture: ComponentFixture<FinesAccDetailsAccountHeadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccDetailsAccountHeadingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDetailsAccountHeadingComponent);
    component = fixture.componentInstance;
    component.accountData = FINES_ACC_DEFENDANT_ACCOUNT_HEADER_MOCK;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
