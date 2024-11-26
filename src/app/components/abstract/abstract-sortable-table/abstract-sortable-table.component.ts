import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { SortService } from '@services/sort-service/sort-service';
import { IAbstractSortState, IAbstractTableData } from './interfaces/abstract-sortable-table-interfaces';

@Component({
  standalone: true,
  template: '',
})
export abstract class AbstractSortableTableComponent implements OnInit {
  public abstractTableData!: IAbstractTableData<string | number | boolean>[];
  public abstractExistingSortState!: IAbstractSortState | null;
  @Output() abstractSortState = new EventEmitter<IAbstractSortState>();

  private readonly sortService = inject(SortService);
  public sortState: IAbstractSortState = {};

  private initialiseSortState(): void {
    if (this.abstractExistingSortState) {
      this.setSortState(this.abstractExistingSortState);
    } else {
      this.createSortState(this.abstractTableData);
    }
  } //** this method validates if the existing sort state exists which will set the sort state to that, if not it will create a sort state. */

  private setSortState(sortState: IAbstractSortState): void {
    this.sortState = sortState;
  } //** This method sets the sort state to the existing state being passed in. */

  public createSortState(tableData: IAbstractTableData<string | number | boolean>[]): void {
    if (tableData.length > 0) {
      Object.keys(tableData[0]).forEach((key) => {
        this.sortState[key] = 'none';
      });
    } else {
      this.sortState = {};
    }
  } //** This method creates a new sort state and sets all values to 'none' */

  public onSortChange(event: { key: string; sortType: 'ascending' | 'descending' }): void {
    const { key, sortType } = event;
    Object.keys(this.sortState).forEach((key) => {
      this.sortState[key] = key === event.key ? event.sortType : 'none';
    });

    if (sortType === 'ascending') {
      this.abstractTableData = this.sortService.sortObjectsAsc(this.abstractTableData, key);
    } else {
      this.abstractTableData = this.sortService.sortObjectsDsc(this.abstractTableData, key);
    }

    this.abstractSortState.emit(this.sortState);
  } //** This method takes in the column key and the sort type and will check check each column if its got a value if not it will be set as none, then uses the sort services to sort the data according to the column keys.*/

  ngOnInit(): void {
    this.initialiseSortState();
  }
}
