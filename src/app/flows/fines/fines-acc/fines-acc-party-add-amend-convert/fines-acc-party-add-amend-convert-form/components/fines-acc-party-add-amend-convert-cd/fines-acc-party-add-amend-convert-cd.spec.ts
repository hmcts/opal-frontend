import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccPartyAddAmendConvertCd } from './fines-acc-party-add-amend-convert-cd';

describe('FinesAccPartyAddAmendConvertCd', () => {
  let component: FinesAccPartyAddAmendConvertCd;
  let fixture: ComponentFixture<FinesAccPartyAddAmendConvertCd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccPartyAddAmendConvertCd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinesAccPartyAddAmendConvertCd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
