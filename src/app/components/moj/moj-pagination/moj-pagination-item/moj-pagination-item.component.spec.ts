import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojPaginationItemComponent } from './moj-pagination-item.component';

describe('MojPaginationItemComponent', () => {
  let component: MojPaginationItemComponent;
  let fixture: ComponentFixture<MojPaginationItemComponent>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(MojPaginationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
