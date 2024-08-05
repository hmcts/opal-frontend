import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesComponent } from './fines.component';

describe('FinesComponent', () => {
  let component: FinesComponent;
  let fixture: ComponentFixture<FinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
