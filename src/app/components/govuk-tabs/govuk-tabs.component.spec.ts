import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukTabsComponent } from './govuk-tabs.component';

describe('GovukTabsComponent', () => {
  let component: GovukTabsComponent;
  let fixture: ComponentFixture<GovukTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukTabsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GovukTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
