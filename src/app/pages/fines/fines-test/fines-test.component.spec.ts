import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesTestComponent } from './fines-test.component';

describe('FinesTestComponent', () => {
  let component: FinesTestComponent;
  let fixture: ComponentFixture<FinesTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinesTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
