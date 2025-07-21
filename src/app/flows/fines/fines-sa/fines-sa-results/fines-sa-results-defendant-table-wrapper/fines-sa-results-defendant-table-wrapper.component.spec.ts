import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesSaResultsDefendantTableWrapperComponent } from './fines-sa-results-defendant-table-wrapper.component';

describe('FinesSaResultsDefendantTableWrapperComponent', () => {
  let component: FinesSaResultsDefendantTableWrapperComponent;
  let fixture: ComponentFixture<FinesSaResultsDefendantTableWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesSaResultsDefendantTableWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSaResultsDefendantTableWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
