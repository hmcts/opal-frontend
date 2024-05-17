import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukCheckboxesItemComponent } from './govuk-checkboxes-item.component';

describe('GovukCheckboxesItemComponent', () => {
  let component: GovukCheckboxesItemComponent;
  let fixture: ComponentFixture<GovukCheckboxesItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukCheckboxesItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GovukCheckboxesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
