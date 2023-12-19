import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukSummaryListRowComponent } from './govuk-summary-list-row.component';

describe('GovukSummaryListRowComponent', () => {
  let component: GovukSummaryListRowComponent;
  let fixture: ComponentFixture<GovukSummaryListRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukSummaryListRowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GovukSummaryListRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
