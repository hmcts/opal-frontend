import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukTagComponent } from './govuk-tag.component';

describe('GovukTagComponent', () => {
  let component: GovukTagComponent;
  let fixture: ComponentFixture<GovukTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukTagComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GovukTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
