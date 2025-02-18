import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojSortableTableStatusComponent } from './moj-sortable-table-status.component';

describe('MojSortableTableStatusComponent', () => {
  let component: MojSortableTableStatusComponent;
  let fixture: ComponentFixture<MojSortableTableStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojSortableTableStatusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojSortableTableStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
