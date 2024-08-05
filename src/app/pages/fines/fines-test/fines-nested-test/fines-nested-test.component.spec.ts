import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesNestedTestComponent } from './fines-nested-test.component';

describe('FinesNestedTestComponent', () => {
  let component: FinesNestedTestComponent;
  let fixture: ComponentFixture<FinesNestedTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesNestedTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinesNestedTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
