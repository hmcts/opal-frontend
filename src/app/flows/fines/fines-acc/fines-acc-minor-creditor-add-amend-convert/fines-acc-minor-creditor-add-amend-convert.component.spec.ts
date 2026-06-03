import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccMinorCreditorAddAmendConvertComponent } from './fines-acc-minor-creditor-add-amend-convert.component';

describe('FinesAccMinorCreditorAddAmendConvertComponent', () => {
  let component: FinesAccMinorCreditorAddAmendConvertComponent;
  let fixture: ComponentFixture<FinesAccMinorCreditorAddAmendConvertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccMinorCreditorAddAmendConvertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccMinorCreditorAddAmendConvertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
