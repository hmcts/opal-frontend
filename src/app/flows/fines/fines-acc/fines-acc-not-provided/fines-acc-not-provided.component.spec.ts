import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccNotProvidedComponent } from './fines-acc-not-provided.component';

describe('FinesAccNotProvidedComponent', () => {
  let component: FinesAccNotProvidedComponent;
  let fixture: ComponentFixture<FinesAccNotProvidedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccNotProvidedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccNotProvidedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
