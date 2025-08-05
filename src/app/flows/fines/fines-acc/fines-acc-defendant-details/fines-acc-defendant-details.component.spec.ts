import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccDefendantDetailsComponent } from './fines-acc-defendant-details.component';

describe('FinesAccDefendantDetailsComponent', () => {
  let component: FinesAccDefendantDetailsComponent;
  let fixture: ComponentFixture<FinesAccDefendantDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccDefendantDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDefendantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
