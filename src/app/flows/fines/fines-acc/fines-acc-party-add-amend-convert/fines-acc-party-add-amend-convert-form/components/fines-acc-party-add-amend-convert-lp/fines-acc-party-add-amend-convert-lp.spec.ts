import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccPartyAddAmendConvertLp } from './fines-acc-party-add-amend-convert-lp';

describe('FinesAccPartyAddAmendConvertLp', () => {
  let component: FinesAccPartyAddAmendConvertLp;
  let fixture: ComponentFixture<FinesAccPartyAddAmendConvertLp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccPartyAddAmendConvertLp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinesAccPartyAddAmendConvertLp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
