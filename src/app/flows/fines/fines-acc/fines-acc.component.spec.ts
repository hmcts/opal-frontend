import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccComponent } from './fines-acc.component';

describe('FinesAccComponent', () => {
  let component: FinesAccComponent;
  let fixture: ComponentFixture<FinesAccComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
