import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableWrapComponent } from './table-wrap.component';

describe('TableWrapComponent', () => {
  let component: TableWrapComponent;
  let fixture: ComponentFixture<TableWrapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableWrapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableWrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
