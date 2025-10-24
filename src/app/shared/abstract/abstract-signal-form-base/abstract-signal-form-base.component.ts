import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  Signal,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Subject, startWith, takeUntil } from 'rxjs';
import {
  IAbstractFormBaseFieldError,
  IAbstractFormBaseFieldErrors,
  IAbstractFormBaseForm,
  IAbstractFormBaseFormError,
  IAbstractFormBaseFormErrorSummaryMessage,
  IAbstractFormControlErrorMessage,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { SignalFormControlAdapter } from '../../forms/signal-forms';

@Component({
  template: '',
  standalone: true,
})
export abstract class AbstractSignalFormBaseComponent<TFormData>
  implements OnInit, OnDestroy
{
  @Output() readonly unsavedChanges = new EventEmitter<boolean>();
  @Output() readonly formSubmit =
    new EventEmitter<IAbstractFormBaseForm<TFormData>>();

  protected readonly utilsService = inject(UtilsService);
  protected readonly changeDetectorRef = inject(ChangeDetectorRef);
  protected readonly router = inject(Router);
  protected readonly activatedRoute = inject(ActivatedRoute);

  protected fieldErrors!: IAbstractFormBaseFieldErrors;
  public form!: FormGroup;
  protected formSubmitted = false;
  protected formErrors: IAbstractFormBaseFormError[] = [];
  public formControlErrorMessages!: IAbstractFormControlErrorMessage;
  public formErrorSummaryMessage!: IAbstractFormBaseFormErrorSummaryMessage[];

  private readonly signalControls = new Map<string, SignalFormControlAdapter>();
  private readonly ngUnsubscribe = new Subject<void>();

  public formValueSignal!: Signal<TFormData>;

  protected abstract initialiseForm(): void;

  protected createControl<T>(
    controlName: string,
    validators: ValidatorFn[] = [],
    initialValue: T | null = null,
  ): void {
    const control = new FormControl<T | null>(initialValue, validators, {
      updateOn: 'change',
    });
    this.form.addControl(controlName, control);
  }

  protected registerExistingControl(controlName: string, control: FormControl): void {
    this.form.addControl(controlName, control);
  }

  protected removeControl(controlName: string): void {
    const adapter = this.signalControls.get(controlName);
    adapter?.destroy();
    this.signalControls.delete(controlName);
    this.form.removeControl(controlName);
    delete this.formControlErrorMessages[controlName];
  }

  protected getSignalControlAdapter<T = unknown>(
    controlName: string,
  ): SignalFormControlAdapter<T> {
    const existing = this.signalControls.get(controlName);
    if (existing) {
      return existing as SignalFormControlAdapter<T>;
    }
    const control = this.form.get(controlName) as FormControl<T | null> | null;
    if (!control) {
      throw new Error(`Control "${controlName}" does not exist on the form`);
    }
    const adapter = new SignalFormControlAdapter<T>(control);
    this.signalControls.set(controlName, adapter);
    return adapter;
  }

  protected setInitialErrorMessages(): void {
    const initial: IAbstractFormControlErrorMessage = {};
    Object.keys(this.form.controls).forEach((controlName) => {
      initial[controlName] = null;
    });
    this.formControlErrorMessages = initial;
    this.formErrorSummaryMessage = [];
  }

  protected rePopulateForm(state: TFormData): void {
    this.form.patchValue(state as unknown as Record<string, unknown>, {
      emitEvent: false,
    });
  }

  public handleFormSubmit(event: SubmitEvent): void {
    event.preventDefault();
    this.handleErrorMessages();
    if (this.form.valid) {
      this.formSubmitted = true;
      const nestedFlow =
        event.submitter instanceof HTMLElement &&
        event.submitter.className.includes('nested-flow');
      this.unsavedChanges.emit(this.hasUnsavedChanges());
      this.formSubmit.emit({
        formData: this.form.getRawValue() as TFormData,
        nestedFlow,
      });
    } else {
      this.focusAndScrollToErrorSummary();
    }
  }

  public handleRoute(
    route: string,
    nonRelative = false,
    event?: Event,
    routeData?: unknown,
  ): void {
    if (event) {
      event.preventDefault();
    }
    this.unsavedChanges.emit(this.hasUnsavedChanges());
    const navigationExtras = {
      ...(nonRelative ? {} : { relativeTo: this.activatedRoute.parent }),
      ...(routeData === undefined ? {} : { state: routeData }),
    };
    this.router.navigate([route], navigationExtras);
  }

  public scrollTo(fieldId: string): void {
    const autocompleteLabel = document.querySelector<HTMLElement>(
      `label[for="${fieldId}-autocomplete"]`,
    );
    const regularLabel = document.querySelector<HTMLElement>(
      `label[for="${fieldId}"]`,
    );
    const fieldsetLegend = document.querySelector<HTMLElement>(
      `[id="${fieldId}"] .govuk-fieldset__legend`,
    );

    const focusableSelector =
      'input:not([type="hidden"]), select, textarea, button, [tabindex]:not([tabindex="-1"])';

    let fieldElement =
      document.getElementById(`${fieldId}-autocomplete`) ??
      document.getElementById(fieldId);

    if (fieldElement && !this.canReceiveFocus(fieldElement)) {
      const nestedFocusable =
        fieldElement.querySelector<HTMLElement>(focusableSelector);
      if (nestedFocusable) {
        fieldElement = nestedFocusable;
      }
    }

    fieldElement ??= document.querySelector<HTMLElement>(
      `[id="${fieldId}"] ${focusableSelector}`,
    );

    (autocompleteLabel ?? regularLabel ?? fieldsetLegend ?? fieldElement)?.scrollIntoView({
      behavior: 'smooth',
    });
    fieldElement?.focus();
  }

  ngOnInit(): void {
    this.form = new FormGroup({});
    this.initialiseForm();
    this.setInitialErrorMessages();
    this.setupSignals();
    this.setupListener();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.signalControls.forEach((adapter) => adapter.destroy());
    this.signalControls.clear();
  }

  private setupSignals(): void {
    this.formValueSignal = toSignal(
      this.form.valueChanges.pipe(
        startWith(this.form.getRawValue() as TFormData),
      ),
      { initialValue: this.form.getRawValue() as TFormData },
    );
  }

  private setupListener(): void {
    this.form.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.unsavedChanges.emit(this.hasUnsavedChanges());
    });
  }

  private handleErrorMessages(): void {
    const errorMessages: IAbstractFormControlErrorMessage = {
      ...this.formControlErrorMessages,
    };
    const summary: IAbstractFormBaseFormErrorSummaryMessage[] = [];

    Object.entries(this.form.controls).forEach(([controlName, control]) => {
      const errors = control.errors ? Object.keys(control.errors) : [];
      if (!errors.length) {
        errorMessages[controlName] = null;
        return;
      }

      const fieldError =
        (this.fieldErrors?.[controlName] as IAbstractFormBaseFieldError) ?? null;
      if (!fieldError) {
        errorMessages[controlName] = null;
        return;
      }

      const highestPriorityError = this.getHighestPriorityError(errors, fieldError);

      if (highestPriorityError) {
        errorMessages[controlName] = highestPriorityError.message;
        summary.push({
          fieldId: controlName,
          message: highestPriorityError.message,
          priority: highestPriorityError.priority,
          type: null,
        });
      }
    });

    this.formControlErrorMessages = errorMessages;
    this.formErrorSummaryMessage = summary.sort(
      (a, b) => a.priority - b.priority,
    );
  }

  private getHighestPriorityError(
    errorKeys: string[],
    fieldError: IAbstractFormBaseFieldError,
  ): { message: string; priority: number } | null {
    const availableErrors = errorKeys
      .map((key) => fieldError[key])
      .filter(Boolean) as { message: string; priority: number }[];

    if (!availableErrors.length) {
      return null;
    }

    return availableErrors.reduce((highest, current) =>
      current.priority < highest.priority ? current : highest,
    );
  }

  private focusAndScrollToErrorSummary(): void {
    this.changeDetectorRef.detectChanges();
    const errorSummary = document.querySelector<HTMLElement>(
      '.govuk-error-summary',
    );
    if (!errorSummary) {
      return;
    }
    errorSummary.focus({ preventScroll: true });
    this.utilsService.scrollToTop();
  }

  private canReceiveFocus(element: HTMLElement): boolean {
    if (element.tabIndex >= 0 && !element.hasAttribute('disabled')) {
      return true;
    }

    if (element instanceof HTMLAnchorElement) {
      return !!element.getAttribute('href');
    }

    return (
      element instanceof HTMLInputElement ||
      element instanceof HTMLSelectElement ||
      element instanceof HTMLTextAreaElement ||
      element instanceof HTMLButtonElement
    ) && !element.disabled;
  }

  private hasUnsavedChanges(): boolean {
    return this.form.dirty && !this.formSubmitted;
  }
}
