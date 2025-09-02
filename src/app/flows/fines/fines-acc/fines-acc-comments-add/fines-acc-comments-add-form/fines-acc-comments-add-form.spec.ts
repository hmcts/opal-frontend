import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccCommentsAddFormComponent } from './fines-acc-comments-add-form';

describe('FinesAccCommentsAddForm', () => {
  let component: FinesAccCommentsAddFormComponent;
  let fixture: ComponentFixture<FinesAccCommentsAddFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccCommentsAddFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinesAccCommentsAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
