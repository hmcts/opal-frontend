import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccPartyAddAmendConvertPartyDetails } from './fines-acc-party-add-amend-convert-party-details';

describe('FinesAccPartyAddAmendConvertPartyDetails', () => {
  let component: FinesAccPartyAddAmendConvertPartyDetails;
  let fixture: ComponentFixture<FinesAccPartyAddAmendConvertPartyDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccPartyAddAmendConvertPartyDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinesAccPartyAddAmendConvertPartyDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
