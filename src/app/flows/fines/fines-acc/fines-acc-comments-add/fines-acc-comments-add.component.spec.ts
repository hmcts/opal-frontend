import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccCommentsAddComponent } from './fines-acc-comments-add.component';

describe('FinesAccCommentsAddComponent', () => {
  let component: FinesAccCommentsAddComponent;
  let fixture: ComponentFixture<FinesAccCommentsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccCommentsAddComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccCommentsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
