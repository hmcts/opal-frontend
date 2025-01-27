import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  afterNextRender,
  inject,
} from '@angular/core';
import { FormControl, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { IAlphagovAccessibleAutocompleteItem } from './interfaces';
import { AccessibleAutocompleteProps } from 'accessible-autocomplete';
import { Subject, pairwise, startWith, takeUntil } from 'rxjs';

@Component({
  selector: 'app-alphagov-accessible-autocomplete',

  imports: [ReactiveFormsModule],
  templateUrl: './alphagov-accessible-autocomplete.component.html',
  styleUrl: './alphagov-accessible-autocomplete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlphagovAccessibleAutocompleteComponent implements OnInit, OnDestroy {
  @Input({ required: true }) labelText!: string;
  @Input({ required: false }) labelClasses!: string;
  @Input({ required: true }) inputId!: string;
  @Input({ required: true }) inputName!: string;
  @Input({ required: false }) inputClasses!: string;
  @Input({ required: false }) hintText!: string;
  @Input({ required: true }) autoCompleteItems: IAlphagovAccessibleAutocompleteItem[] = [];
  @Input() showAllValues = false;
  @Input({ required: false }) errors: string | null = null;

  @ViewChild('autocomplete') autocompleteContainer!: ElementRef<HTMLElement>;

  private readonly changeDetector: ChangeDetectorRef = inject(ChangeDetectorRef);
  private _control!: FormControl;
  private readonly ngUnsubscribe = new Subject<void>();
  public autoCompleteId!: string;

  @Input({ required: true }) set control(abstractControl: AbstractControl | null) {
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
    const control = this._control;
    const name = selectedName ?? (document.querySelector(`#${this.autoCompleteId}`) as HTMLInputElement).value;
    const selectedItem = this.autoCompleteItems.find((item) => item.name === name) ?? null;
    const previousValue = control.value;
    const selectedValue = selectedItem?.value ?? null;

    control.setValue(selectedValue);
    control.markAsTouched();

    // Handles initial empty state when the user clicks away from the input
    if (selectedItem === null && previousValue === null) {
      control.markAsPristine();
    } else if (selectedItem?.value !== previousValue) {
      control.markAsDirty();
    }

    control.updateValueAndValidity();
    this.changeDetector.detectChanges();
  }

  /**
   * Retrieves the default value for the autocomplete component.
   *
   * @returns The default value as a string.
   */

  private getDefaultValue() {
    return this.autoCompleteItems.find((item) => item.value === this._control.value)?.name ?? '';
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
      defaultValue: this.getDefaultValue(),
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

  /**
   * Sets up the control subscription for value changes.
   * Whenever the control value changes, this method is called to handle the changes.
   * If the new value is null, it clears the autocomplete container and configures the autocomplete.
   */
  private setupControlSub(): void {
    this._control.valueChanges
      .pipe(startWith(null), pairwise(), takeUntil(this.ngUnsubscribe))
      .subscribe(([prev, next]) => {
        // If both values are null, we don't need to do anything
        if (prev === null && next === null) {
          return;
        }

        // Otherwise, next is null, we need to clear the autocomplete
        if (next === null) {
          this.autocompleteContainer.nativeElement.innerHTML = '';
          this.configureAutoComplete();
        }
      });
  }

  ngOnInit(): void {
    this.autoCompleteId = this.inputId + '-autocomplete';
    this.setupControlSub();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
