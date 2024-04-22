import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild, afterNextRender } from '@angular/core';
import { FormControl, AbstractControl } from '@angular/forms';
import { IAutoCompleteItem } from '@interfaces';
import { AccessibleAutocompleteProps } from 'accessible-autocomplete';

@Component({
  selector: 'app-alphagov-accessible-autocomplete',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './alphagov-accessible-autocomplete.component.html',
  styleUrl: './alphagov-accessible-autocomplete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlphagovAccessibleAutocompleteComponent {
  private _control!: FormControl;
  @Input({ required: true }) set control(abstractControl: AbstractControl) {
    // Form controls are passed in as abstract controls, we need to re-cast it.
    this._control = abstractControl as FormControl;
  }
  @Input({ required: true }) labelText!: string;
  @Input({ required: false }) labelClasses!: string;
  @Input({ required: true }) inputId!: string;
  @Input({ required: true }) inputName!: string;
  @Input({ required: false }) inputClasses!: string;
  @Input({ required: true }) autoCompleteItems: IAutoCompleteItem[] = [];

  @Input() showAllValues = false;

  @ViewChild('autocomplete') autocompleteContainer!: ElementRef<HTMLElement>;

  constructor() {
    afterNextRender(() => {
      // Only trigger the render of the component in the browser
      this.configureAutoComplete();
    });
  }

  private handleOnConfirm = (selectedName: string) => {
    // selectedName is populated on selecting an option but is undefined onBlur, so we need to grab the input value directly from the input
    const name = selectedName || (document.querySelector(`#${this.inputId}`) as HTMLInputElement).value;
    const selectedItem = this.autoCompleteItems.find((item) => item.name === name) ?? null;

    this._control.setValue(selectedItem?.value);
    this._control.markAsTouched();
    this._control.markAsDirty();
  };

  private buildAutoCompleteProps(): AccessibleAutocompleteProps {
    return {
      id: this.inputId,
      element: this.autocompleteContainer.nativeElement,
      source: this.autoCompleteItems.map((item) => item.name),
      name: this.inputId,
      showAllValues: this.showAllValues,
      defaultValue: this._control.value || '',
      onConfirm: (selectedName: string) => this.handleOnConfirm(selectedName),
    };
  }

  configureAutoComplete() {
    this.autocompleteContainer.nativeElement.innerHTML = '';

    import('accessible-autocomplete').then((accessibleAutocomplete) => {
      accessibleAutocomplete.default(this.buildAutoCompleteProps());
    });
  }
}
