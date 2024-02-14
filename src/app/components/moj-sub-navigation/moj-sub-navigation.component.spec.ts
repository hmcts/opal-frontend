import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojSubNavigationComponent } from './moj-sub-navigation.component';

describe('MojSubNavigationComponent', () => {
  let component: MojSubNavigationComponent;
  let fixture: ComponentFixture<MojSubNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojSubNavigationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MojSubNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
