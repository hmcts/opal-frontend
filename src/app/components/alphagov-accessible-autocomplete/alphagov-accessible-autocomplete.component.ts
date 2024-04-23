import { TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  afterNextRender,
  inject,
} from '@angular/core';
import { FormControl, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { IAutoCompleteItem } from '@interfaces';
import { AccessibleAutocompleteProps } from 'accessible-autocomplete';

@Component({
  selector: 'app-alphagov-accessible-autocomplete',
  standalone: true,
  imports: [TitleCasePipe, ReactiveFormsModule],
  templateUrl: './alphagov-accessible-autocomplete.component.html',
  styleUrl: './alphagov-accessible-autocomplete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlphagovAccessibleAutocompleteComponent implements OnInit {
  @Input({ required: true }) labelText!: string;
  @Input({ required: false }) labelClasses!: string;
  @Input({ required: true }) inputId!: string;
  @Input({ required: true }) inputName!: string;
  @Input({ required: false }) inputClasses!: string;
  @Input({ required: true }) autoCompleteItems: IAutoCompleteItem[] = [];
  @Input() showAllValues = false;

  @ViewChild('autocomplete') autocompleteContainer!: ElementRef<HTMLElement>;

  private readonly changeDetector: ChangeDetectorRef = inject(ChangeDetectorRef);
  private _control!: FormControl;
  public autoCompleteId!: string;

  @Input({ required: true }) set control(abstractControl: AbstractControl) {
    // Form controls are passed in as abstract controls, we need to re-cast it.
    this._control = abstractControl as FormControl;
  }

  constructor() {
    afterNextRender(() => {
      // Only trigger the render of the component in the browser
      this.configureAutoComplete();
    });
  }

  /**
   * Gets the control for the alphagov-accessible-autocomplete component.
   * @returns The control for the component.
   */
  get getControl() {
    return this._control;
  }

  /**
   * Handles the confirmation of a selected name.
   *
   * @param selectedName - The selected name.
   * @returns void
   */
  private handleOnConfirm(selectedName: string | undefined): void {
    // selectedName is populated on selecting an option but is undefined onBlur, so we need to grab the input value directly from the input
    const name = selectedName || (document.querySelector(`#${this.autoCompleteId}`) as HTMLInputElement).value;
    const selectedItem = this.autoCompleteItems.find((item) => item.name === name) ?? null;
    const previousValue = this._control.value;
    const selectedValue = selectedItem?.value || null;

    this._control.setValue(selectedValue);
    this._control.markAsTouched();

    // Handles initial empty state when the user clicks away from the input
    if (selectedItem === null && previousValue === null) {
      this._control.markAsPristine();
    } else if (selectedItem?.value !== previousValue) {
      this._control.markAsDirty();
    }

    this._control.updateValueAndValidity();
    this.changeDetector.detectChanges();
  }

  /**
   * Builds the props object for the AccessibleAutocomplete component.
   * @returns The props object for the AccessibleAutocomplete component.
   */
  private buildAutoCompleteProps(): AccessibleAutocompleteProps {
    return {
      id: this.autoCompleteId,
      element: this.autocompleteContainer.nativeElement,
      source: this.autoCompleteItems.map((item) => item.name),
      name: this.autoCompleteId,
      showAllValues: this.showAllValues,
      defaultValue: this._control.value || '',
      onConfirm: (selectedName: string) => this.handleOnConfirm(selectedName),
    };
  }

  /**
   * Configures the auto-complete functionality using the accessible-autocomplete library.
   */
  private configureAutoComplete(): void {
    import('accessible-autocomplete').then((accessibleAutocomplete) => {
      accessibleAutocomplete.default(this.buildAutoCompleteProps());
    });
  }

  ngOnInit(): void {
    this.autoCompleteId = this.inputId + '-autocomplete';
  }
}
