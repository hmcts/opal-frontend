import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccPartyAddAmendConvertEd } from './fines-acc-party-add-amend-convert-ed';

describe('FinesAccPartyAddAmendEd', () => {
  let component: FinesAccPartyAddAmendConvertEd;
  let fixture: ComponentFixture<FinesAccPartyAddAmendConvertEd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccPartyAddAmendConvertEd],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccPartyAddAmendConvertEd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
