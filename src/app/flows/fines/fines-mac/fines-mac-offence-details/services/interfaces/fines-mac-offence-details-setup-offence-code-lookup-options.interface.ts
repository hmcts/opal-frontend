import { FormGroup } from '@angular/forms';
import { IOpalFinesOffencesRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences-ref-data.interface';
import { Observable, Subject } from 'rxjs';

/**
 * Configuration for wiring offence-code lookup behaviour into a form.
 */
export interface IFinesMacOffenceDetailsSetupOffenceCodeLookupOptions {
  /** The form containing the offence code and offence id controls. */
  form: FormGroup;
  /** The control name used for the offence code input. */
  codeControlName: string;
  /** The control name used to store the resolved offence id. */
  idControlName: string;
  /** Emits when the caller tears down subscriptions for the host component. */
  destroy$: Subject<void>;
  /** Executes the offence-code lookup request against the backing service. */
  getOffenceByCjsCode: (code: string) => Observable<IOpalFinesOffencesRefData>;
  /** Receives each successful lookup response so the caller can update local state. */
  onResult: (result: IOpalFinesOffencesRefData) => void;
  /** Receives whether the current offence code has been confirmed by lookup state. */
  onConfirmChange: (confirmed: boolean) => void;
  /** Indicates whether the parent form has already been submitted once. */
  hasAttemptedSubmit: () => boolean;
  /** Re-renders submitted-state errors after async lookup state changes. */
  refreshSubmittedErrors: () => void;
}
