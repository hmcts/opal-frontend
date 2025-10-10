import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesNotProvidedComponent } from './fines-not-provided.component';

describe('FinesNotProvidedComponent', () => {
  let component: FinesNotProvidedComponent;
  let fixture: ComponentFixture<FinesNotProvidedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesNotProvidedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesNotProvidedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
