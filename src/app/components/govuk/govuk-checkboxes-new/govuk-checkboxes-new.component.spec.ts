import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukCheckboxesNewComponent } from './govuk-checkboxes-new.component';

describe('GovukCheckboxesNewComponent', () => {
  let component: GovukCheckboxesNewComponent;
  let fixture: ComponentFixture<GovukCheckboxesNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukCheckboxesNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GovukCheckboxesNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
