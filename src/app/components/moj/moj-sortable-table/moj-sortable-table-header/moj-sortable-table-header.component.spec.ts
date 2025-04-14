import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojSortableTableHeaderComponent } from './moj-sortable-table-header.component';
import { By } from '@angular/platform-browser';

describe('MojSortableTableHeaderComponent', () => {
  let component: MojSortableTableHeaderComponent;
  let fixture: ComponentFixture<MojSortableTableHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MojSortableTableHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojSortableTableHeaderComponent);
    component = fixture.componentInstance;
    spyOn(component.sortChange, 'emit');
    component.columnKey = 'test-column';
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set columnKey correctly', () => {
    component.columnKey = 'test-column';
    expect(component.columnKey).toBe('test-column');
  });

  it('should set dataIndex correctly', () => {
    component.dataIndex = 2;
    expect(component.dataIndex).toBe(2);
  });

  it('should have default sortDirection as "none"', () => {
    expect(component.sortDirection).toBe('none');
  });

  it('should allow sortDirection to be set', () => {
    component.sortDirection = 'ascending';
    expect(component.sortDirection).toBe('ascending');
  });

  it('should emit sortChange with correct key and sortType on toggleSort', () => {
    component.columnKey = 'test-column';
    component.sortDirection = 'ascending';

    component.toggleSort();

    expect(component.sortChange.emit).toHaveBeenCalledWith({
      key: 'test-column',
      sortType: 'descending',
    });
  });

  it('should emit "ascending" when sortDirection is "none"', () => {
    component.sortDirection = 'none';
    component.toggleSort();

    expect(component.sortChange.emit).toHaveBeenCalledWith({
      key: 'test-column',
      sortType: 'ascending',
    });
  });

  it('should emit "descending" when sortDirection is "ascending"', () => {
    component.sortDirection = 'ascending';
    component.toggleSort();

    expect(component.sortChange.emit).toHaveBeenCalledWith({
      key: 'test-column',
      sortType: 'descending',
    });
  });

  it('should emit "ascending" when sortDirection is "descending"', () => {
    component.sortDirection = 'descending';
    component.toggleSort();

    expect(component.sortChange.emit).toHaveBeenCalledWith({
      key: 'test-column',
      sortType: 'ascending',
    });
  });

  it('should not update sortDirection directly', () => {
    component.sortDirection = 'none';
    component.toggleSort();

    expect(component.sortDirection).toBe('none'); // Verifying that the method doesn't update the state
  });

  it('should return the current sortDirection as aria-sort', () => {
    component.sortDirection = 'ascending';
    expect(component.ariaSort).toBe('ascending');

    component.sortDirection = 'descending';
    expect(component.ariaSort).toBe('descending');

    component.sortDirection = 'none';
    expect(component.ariaSort).toBe('none');
  });

  it('should bind scope to "col"', () => {
    expect(component.hostScope).toBe('col');
  });

  it('should bind class to "govuk-table__header"', () => {
    expect(component.hostClass).toBe('govuk-table__header');
  });

  it('should render a button with ng-content', () => {
    const button = fixture.debugElement.query(By.css('button'));
    expect(button).toBeTruthy();
  });

  it('should call toggleSort on button click', () => {
    spyOn(component, 'toggleSort');
    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();

    expect(component.toggleSort).toHaveBeenCalled();
  });

  it('should set data-index attributes on button', () => {
    component.dataIndex = 2;
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button'));
    expect(button.attributes['data-index']).toBe('2');
  });
});
