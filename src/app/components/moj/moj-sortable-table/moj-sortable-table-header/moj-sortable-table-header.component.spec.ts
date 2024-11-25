import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { MojSortableTableHeaderComponent } from './moj-sortable-table-header.component';

@Component({
  template: `<th app-moj-sortable-table-header [sortDirection]="sortDirection">Test Column</th>`,
})
class TestWrapperComponent {
  sortDirection: 'none' | 'ascending' | 'descending' = 'none';
}

describe('MojSortableTableHeaderComponent', () => {
  let fixture: ComponentFixture<TestWrapperComponent>;
  let component: TestWrapperComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojSortableTableHeaderComponent],
      declarations: [TestWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have the scope attribute set to "col"', () => {
    const thElement = fixture.debugElement.query(By.css('th'));
    expect(thElement.attributes['scope']).toBe('col');
  });

  it('should have the correct host class', () => {
    const thElement = fixture.debugElement.query(By.css('th'));
    expect(thElement.nativeElement.classList.contains('govuk-table__header')).toBe(true);
  });

  it('should have aria-sort attribute set to "ascending" when sortDirection is "ascending"', () => {
    component.sortDirection = 'ascending';
    fixture.detectChanges();
    const thElement = fixture.debugElement.query(By.css('th'));
    expect(thElement.attributes['aria-sort']).toBe('ascending');
  });

  it('should have aria-sort attribute set to "descending" when sortDirection is "descending"', () => {
    component.sortDirection = 'descending';
    fixture.detectChanges();
    const thElement = fixture.debugElement.query(By.css('th'));
    expect(thElement.attributes['aria-sort']).toBe('descending');
  });
});
