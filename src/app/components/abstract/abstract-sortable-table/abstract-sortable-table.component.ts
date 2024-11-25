import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { IObjectSortableInterface } from '@services/sort-service/interfaces/sort-service-interface';
import { SortService } from '@services/sort-service/sort-service';
import { ISortStateInterface } from './interfaces/abstract-sortable-table-interfaces';

@Component({
  standalone: true,
  template: '',
})
export abstract class AbstractSortableTableComponent implements OnInit {
  public abstractTableData!: IObjectSortableInterface<string | number | boolean>[];
  public abstractExistingSortState!: ISortStateInterface | null;
  @Output() abstractSortState = new EventEmitter<ISortStateInterface>();

  private readonly sortService = inject(SortService);
  public sortState: ISortStateInterface = {};

  private initialiseSortState(): void {
    if (this.abstractExistingSortState) {
      this.setSortState(this.abstractExistingSortState);
    } else {
      this.createSortState(this.abstractTableData);
    }
  }

  private setSortState(sortState: ISortStateInterface): void {
    this.sortState = sortState;
  }

  public createSortState(tableData: IObjectSortableInterface<string | number | boolean>[]): void {
    if (tableData.length >= 0) {
      Object.keys(tableData[0]).forEach((key) => {
        this.sortState[key] = 'none';
      });
    }
  }

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
  }

  ngOnInit(): void {
    this.initialiseSortState();
  }
}
