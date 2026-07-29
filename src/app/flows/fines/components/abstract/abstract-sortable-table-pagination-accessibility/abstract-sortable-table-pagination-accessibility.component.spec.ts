import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AbstractSortableTablePaginationAccessibilityComponent } from './abstract-sortable-table-pagination-accessibility.component';

@Component({
  standalone: true,
  template: '<div id="pagination-top" tabindex="-1"></div>',
})
class TestPaginationAccessibilityComponent extends AbstractSortableTablePaginationAccessibilityComponent {
  public readonly paginationTopElementId = 'pagination-top';
}

describe('AbstractSortableTablePaginationAccessibilityComponent', () => {
  let component: TestPaginationAccessibilityComponent;
  let fixture: ComponentFixture<TestPaginationAccessibilityComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let utilsService: any;

  beforeEach(async () => {
    utilsService = {
      scrollToTop: vi.fn().mockName('UtilsService.scrollToTop'),
    };

    await TestBed.configureTestingModule({
      imports: [TestPaginationAccessibilityComponent],
      providers: [{ provide: UtilsService, useValue: utilsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestPaginationAccessibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should expose the current page status message', () => {
    expect(component.paginationStatusMessageComputed()).toBe('Page 1 loaded');
  });

  it('should scroll to the top anchor and focus it when the page changes', () => {
    component.displayTableDataSignal.set([{ id: 1 }, { id: 2 }] as never[]);
    component.itemsPerPageSignal.set(1);
    fixture.detectChanges();

    const topAnchor = fixture.nativeElement.querySelector('#pagination-top') as HTMLDivElement | null;
    expect(topAnchor).toBeTruthy();
    if (!topAnchor) {
      throw new Error('Top anchor not found');
    }

    const focusSpy = vi.spyOn(topAnchor, 'focus');

    component.onPageChange(2);
    fixture.detectChanges();

    expect(component.currentPageSignal()).toBe(2);
    expect(component.paginationStatusMessageComputed()).toBe('Page 2 loaded');
    expect(utilsService.scrollToTop).toHaveBeenCalled();
    expect(focusSpy).toHaveBeenCalled();
  });
});
