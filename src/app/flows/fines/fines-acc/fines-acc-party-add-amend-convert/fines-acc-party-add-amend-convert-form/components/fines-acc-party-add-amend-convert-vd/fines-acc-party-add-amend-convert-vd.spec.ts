import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccPartyAddAmendConvertVd } from './fines-acc-party-add-amend-convert-vd';

describe('FinesAccPartyAddAmendConvertVd', () => {
  let component: FinesAccPartyAddAmendConvertVd;
  let fixture: ComponentFixture<FinesAccPartyAddAmendConvertVd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccPartyAddAmendConvertVd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinesAccPartyAddAmendConvertVd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
