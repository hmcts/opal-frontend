import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesSaResultsMinorCreditorTableWrapperComponent } from './fines-sa-results-minor-creditor-table-wrapper.component';

describe('FinesSaResultsMinorCreditorTableWrapperComponent', () => {
  let component: FinesSaResultsMinorCreditorTableWrapperComponent;
  let fixture: ComponentFixture<FinesSaResultsMinorCreditorTableWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesSaResultsMinorCreditorTableWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSaResultsMinorCreditorTableWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
