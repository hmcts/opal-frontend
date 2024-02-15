import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojSubNavigationItemComponent } from './moj-sub-navigation-item.component';

describe('MojSubNavigationItemComponent', () => {
  let component: MojSubNavigationItemComponent;
  let fixture: ComponentFixture<MojSubNavigationItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojSubNavigationItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MojSubNavigationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
