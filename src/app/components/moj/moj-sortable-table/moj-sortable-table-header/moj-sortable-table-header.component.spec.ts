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
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('@Input columnKey', () => {
    it('should set columnKey correctly', () => {
      component.columnKey = 'test-column';
      expect(component.columnKey).toBe('test-column');
    });
  });

  describe('@Input titleInput', () => {
    it('should set titleInput correctly', () => {
      component.titleInput = 'test-title';
      expect(component.titleInput).toBe('test-title');
    });
  });

  describe('@Input dataIndex', () => {
    it('should set dataIndex correctly', () => {
      component.dataIndex = 2;
      expect(component.dataIndex).toBe(2);
    });
  });

  describe('@Input sortDirection', () => {
    it('should have default sortDirection as "none"', () => {
      expect(component.sortDirection).toBe('none');
    });

    it('should allow sortDirection to be set', () => {
      component.sortDirection = 'ascending';
      expect(component.sortDirection).toBe('ascending');
    });
  });

  describe('@Output sortChange', () => {
    it('should emit sortChange with correct key and sortType on toggleSort', () => {
      spyOn(component.sortChange, 'emit');
      component.columnKey = 'test-column';
      component.sortDirection = 'ascending';

      component.toggleSort();

      expect(component.sortChange.emit).toHaveBeenCalledWith({
        key: 'test-column',
        sortType: 'descending',
      });
    });
  });

  describe('MojSortableTableHeaderComponent toggleSort', () => {
    beforeEach(() => {
      spyOn(component.sortChange, 'emit');
      component.columnKey = 'test-column';
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
  });

  describe('@HostBinding ariaSort', () => {
    it('should return the current sortDirection as aria-sort', () => {
      component.sortDirection = 'ascending';
      expect(component.ariaSort).toBe('ascending');

      component.sortDirection = 'descending';
      expect(component.ariaSort).toBe('descending');

      component.sortDirection = 'none';
      expect(component.ariaSort).toBe('none');
    });
  });

  describe('@HostBinding hostScope', () => {
    it('should bind scope to "col"', () => {
      expect(component.hostScope).toBe('col');
    });
  });

  describe('@HostBinding hostClass', () => {
    it('should bind class to "govuk-table__header"', () => {
      expect(component.hostClass).toBe('govuk-table__header');
    });
  });

  describe('HTML Template', () => {
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

    it('should set title and data-index attributes on button', () => {
      component.titleInput = 'button';
      component.dataIndex = 2;
      fixture.detectChanges();
      const button = fixture.debugElement.query(By.css('button'));
      expect(button.attributes['title']).toBe('button');
      expect(button.attributes['data-index']).toBe('2');
    });
  });
});
