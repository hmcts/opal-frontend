import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccPartyAddAmendConvertDobNi } from './fines-acc-party-add-amend-convert-dob-ni';

describe('FinesAccPartyAddAmendConvertDobNi', () => {
  let component: FinesAccPartyAddAmendConvertDobNi;
  let fixture: ComponentFixture<FinesAccPartyAddAmendConvertDobNi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccPartyAddAmendConvertDobNi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinesAccPartyAddAmendConvertDobNi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
