import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojPaginationListComponent } from './moj-pagination-list.component';

describe('MojPaginationListComponent', () => {
  let component: MojPaginationListComponent;
  let fixture: ComponentFixture<MojPaginationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojPaginationListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojPaginationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
