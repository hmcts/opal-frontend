import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesSaResultsComponent } from './fines-sa-results.component';

describe('FinesSaResultsComponent', () => {
  let component: FinesSaResultsComponent;
  let fixture: ComponentFixture<FinesSaResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesSaResultsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSaResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
