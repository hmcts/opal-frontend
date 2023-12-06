import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukSelectComponent } from './govuk-select.component';

describe('GovukSelectComponent', () => {
  let component: GovukSelectComponent;
  let fixture: ComponentFixture<GovukSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukSelectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GovukSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
