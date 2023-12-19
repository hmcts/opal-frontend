import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukTabPanelComponent } from './govuk-tab-panel.component';

describe('GovukTabPanelComponent', () => {
  let component: GovukTabPanelComponent;
  let fixture: ComponentFixture<GovukTabPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukTabPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GovukTabPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
