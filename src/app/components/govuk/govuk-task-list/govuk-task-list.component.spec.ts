import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukTaskListComponent } from './govuk-task-list.component';

describe('GovukTaskListComponent', () => {
  let component: GovukTaskListComponent;
  let fixture: ComponentFixture<GovukTaskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukTaskListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GovukTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
