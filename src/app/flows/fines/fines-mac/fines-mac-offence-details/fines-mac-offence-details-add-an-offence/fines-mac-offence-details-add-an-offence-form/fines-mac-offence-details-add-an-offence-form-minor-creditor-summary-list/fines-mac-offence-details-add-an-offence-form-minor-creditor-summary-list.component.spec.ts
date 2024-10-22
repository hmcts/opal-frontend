import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsAddAnOffenceFormMinorCreditorSummaryListComponent } from './fines-mac-offence-details-add-an-offence-form-minor-creditor-summary-list.component';

describe('FinesMacOffenceDetailsAddAnOffenceFormMinorCreditorSummaryListComponent', () => {
  let component: FinesMacOffenceDetailsAddAnOffenceFormMinorCreditorSummaryListComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsAddAnOffenceFormMinorCreditorSummaryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsAddAnOffenceFormMinorCreditorSummaryListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsAddAnOffenceFormMinorCreditorSummaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
