import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojHeaderNavigationItemComponent } from './moj-header-navigation-item.component';

describe('MojHeaderNavigationItemComponent', () => {
  let component: MojHeaderNavigationItemComponent;
  let fixture: ComponentFixture<MojHeaderNavigationItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojHeaderNavigationItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojHeaderNavigationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
