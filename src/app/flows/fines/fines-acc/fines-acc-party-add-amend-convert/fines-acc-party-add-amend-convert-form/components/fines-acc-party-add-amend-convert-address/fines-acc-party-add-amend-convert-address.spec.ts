import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccPartyAddAmendConvertAddress } from './fines-acc-party-add-amend-convert-address';

describe('FinesAccPartyAddAmendConvertAddress', () => {
  let component: FinesAccPartyAddAmendConvertAddress;
  let fixture: ComponentFixture<FinesAccPartyAddAmendConvertAddress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccPartyAddAmendConvertAddress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinesAccPartyAddAmendConvertAddress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
