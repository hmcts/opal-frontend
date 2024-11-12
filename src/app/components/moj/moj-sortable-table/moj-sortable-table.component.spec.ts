import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojSortableTableComponent } from './moj-sortable-table.component';

describe('MojSortableTableComponent', () => {
  let component: MojSortableTableComponent;
  let fixture: ComponentFixture<MojSortableTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojSortableTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojSortableTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
