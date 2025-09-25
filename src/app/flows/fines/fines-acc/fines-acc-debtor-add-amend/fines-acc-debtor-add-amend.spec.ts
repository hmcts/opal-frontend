import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccDebtorAddAmend } from './fines-acc-debtor-add-amend';

describe('FinesAccDebtorAddAmend', () => {
  let component: FinesAccDebtorAddAmend;
  let fixture: ComponentFixture<FinesAccDebtorAddAmend>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccDebtorAddAmend],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDebtorAddAmend);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
