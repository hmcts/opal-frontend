import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukRadiosItemComponent } from './govuk-radios-item.component';

describe('GovukRadiosItemComponent', () => {
  let component: GovukRadiosItemComponent;
  let fixture: ComponentFixture<GovukRadiosItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukRadiosItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GovukRadiosItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
