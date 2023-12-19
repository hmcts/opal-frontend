import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukTabListItemComponent } from './govuk-tab-list-item.component';

describe('GovukTabListItemComponent', () => {
  let component: GovukTabListItemComponent;
  let fixture: ComponentFixture<GovukTabListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukTabListItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GovukTabListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
