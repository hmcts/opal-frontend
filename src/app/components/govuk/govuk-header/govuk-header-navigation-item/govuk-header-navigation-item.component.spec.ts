import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukHeaderNavigationItemComponent } from './govuk-header-navigation-item.component';

describe('GovukHeaderNavigationItemComponent', () => {
  let component: GovukHeaderNavigationItemComponent;
  let fixture: ComponentFixture<GovukHeaderNavigationItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukHeaderNavigationItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukHeaderNavigationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
