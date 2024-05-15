import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukTaskListItemComponent } from './govuk-task-list-item.component';

describe('GovukTaskListItemComponent', () => {
  let component: GovukTaskListItemComponent;
  let fixture: ComponentFixture<GovukTaskListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukTaskListItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GovukTaskListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
