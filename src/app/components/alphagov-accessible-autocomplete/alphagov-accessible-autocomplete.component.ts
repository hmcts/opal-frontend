import { TitleCasePipe, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ApplicationRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
  afterNextRender,
  inject,
} from '@angular/core';
import { AccessibleAutocompleteProps } from 'accessible-autocomplete';

export type AutoCompleteItem = {
  id: number;
  name: string;
};

@Component({
  selector: 'app-alphagov-accessible-autocomplete',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './alphagov-accessible-autocomplete.component.html',
  styleUrl: './alphagov-accessible-autocomplete.component.scss',
})
export class AlphagovAccessibleAutocompleteComponent implements OnInit, OnChanges {
  @Input() data: AutoCompleteItem[] = [];
  @Input({ required: true }) dataType!: string;
  @Input() label = '';
  @Input() selectedData = '';
  @Input() isInvalid = false;
  @Input() showAllValues = false;
  @Input() errors: string[] = [];
  @Output() dataSelect = new EventEmitter<AutoCompleteItem | null>();
  @ViewChild('autocomplete') autocompleteContainer!: ElementRef<HTMLElement>;

  constructor() {
    afterNextRender(() => {
      // Only trigger the render of the component in the browser
      this.configureAutoComplete();
    });
  }
  props: AccessibleAutocompleteProps | null = null;

  ngOnInit() {
    this.data = [
      { name: 'France', id: 1 },
      { name: 'Germany', id: 2 },
      { name: 'United Kingdom', id: 3 },
    ];

    this.props = {
      id: this.dataType + '-autocomplete',
      source: [],
      name: this.dataType + '-autocomplete',
      showAllValues: this.showAllValues,
      onConfirm: (selectedName: string) => {
        // selectedName is populated on selecting an option but is undefined onBlur, so we need to grab the input value directly from the input
        const name =
          selectedName || (document.querySelector(`#${this.dataType}-autocomplete`) as HTMLInputElement).value;
        const selectedItem = this.data.find((d) => d.name === name) ?? null;
        this.dataSelect.emit(selectedItem);
      },
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].isFirstChange()) {
      console.log('Data changed');
      this.configureAutoComplete();
    }
  }

  configureAutoComplete() {
    this.autocompleteContainer.nativeElement.innerHTML = '';

    if (this.props) {
      this.props.element = this.autocompleteContainer.nativeElement;
      this.props.source = this.data.map((item) => item.name);
      this.props.defaultValue = this.selectedData;

      import('accessible-autocomplete').then((accessibleAutocomplete) => {
        if (this.props) {
          accessibleAutocomplete.default(this.props);
        }
      });
    }
  }
}
