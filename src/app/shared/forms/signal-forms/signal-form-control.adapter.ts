import { Signal, WritableSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import { merge, startWith, Subscription } from 'rxjs';

/**
 * Lightweight adapter that bridges an underlying {@link FormControl}
 * into signal-based consumers while keeping compatibility with the
 * existing reactive-form validators/utilities.
 */
export class SignalFormControlAdapter<T = unknown> {
  private readonly subscriptions = new Subscription();
  private readonly touchedInternal: WritableSignal<boolean>;
  private readonly dirtyInternal: WritableSignal<boolean>;

  readonly value: Signal<T | null>;
  readonly errors: Signal<ValidationErrors | null>;
  readonly touched: Signal<boolean>;
  readonly dirty: Signal<boolean>;

  constructor(readonly formControl: FormControl<T | null>) {
    this.value = toSignal(
      this.formControl.valueChanges.pipe(startWith(this.formControl.value)),
      { initialValue: this.formControl.value }
    );

    this.errors = toSignal(
      this.formControl.statusChanges.pipe(
        startWith(this.formControl.status),
      ),
      { initialValue: this.formControl.errors }
    );

    this.touchedInternal = signal(this.formControl.touched);
    this.dirtyInternal = signal(this.formControl.dirty);
    this.touched = this.touchedInternal.asReadonly();
    this.dirty = this.dirtyInternal.asReadonly();

    this.subscriptions.add(
      merge(
        this.formControl.statusChanges,
        this.formControl.valueChanges,
      ).subscribe(() => {
        this.touchedInternal.set(this.formControl.touched);
        this.dirtyInternal.set(this.formControl.dirty);
      }),
    );
  }

  setValue(value: T | null, options?: Parameters<AbstractControl['setValue']>[1]): void {
    this.formControl.setValue(value, options);
  }

  markAsTouched(): void {
    this.formControl.markAsTouched();
  }

  reset(value?: T | null): void {
    this.formControl.reset(value ?? (null as T | null));
  }

  destroy(): void {
    this.subscriptions.unsubscribe();
  }
}
