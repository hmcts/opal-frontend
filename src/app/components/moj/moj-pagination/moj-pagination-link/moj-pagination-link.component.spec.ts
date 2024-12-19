import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojPaginationLinkComponent } from './moj-pagination-link.component';

describe('MojPaginationLinkComponent', () => {
  let component: MojPaginationLinkComponent;
  let fixture: ComponentFixture<MojPaginationLinkComponent>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(MojPaginationLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have required inputs', () => {
    component.page = 2;
    component.currentPage = 1;
    component.totalPages = 10;
    fixture.detectChanges();

    expect(component.page).toBe(2);
    expect(component.currentPage).toBe(1);
    expect(component.totalPages).toBe(10);
  });

  it('should emit changePage event on click', () => {
    spyOn(component.changePage, 'emit');
    component.page = 2;
    component.currentPage = 1;
    component.totalPages = 10;
    fixture.detectChanges();

    const event = new MouseEvent('click');
    component.changePageEvent(event, 2);

    expect(component.changePage.emit).toHaveBeenCalledWith(2);
  });

  it('should prevent default action on click', () => {
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    spyOn(event, 'preventDefault');

    component.changePageEvent(event, 2);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should not emit changePage event if page is the same', () => {
    spyOn(component.changePage, 'emit');
    component.page = 1;
    component.currentPage = 1;
    component.totalPages = 10;
    fixture.detectChanges();

    const event = new MouseEvent('click');
    component.changePageEvent(event, 1);

    expect(component.changePage.emit).not.toHaveBeenCalled();
  });

  it('should not emit changePage event if page is out of range', () => {
    spyOn(component.changePage, 'emit');
    component.page = 0;
    component.currentPage = 1;
    component.totalPages = 10;
    fixture.detectChanges();

    const event = new MouseEvent('click');
    component.changePageEvent(event, 0);
    component.changePageEvent(event, 11);

    expect(component.changePage.emit).not.toHaveBeenCalled();
  });
});
