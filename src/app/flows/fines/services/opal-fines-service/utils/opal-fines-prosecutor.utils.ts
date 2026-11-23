import { IOpalFinesProsecutor } from '../interfaces/opal-fines-prosecutor.interface';

/**
 * Selects the identifier required by app mode without converting prosecutor codes to numbers.
 * Missing or invalid modes retain the original ID integration.
 * @param prosecutor - The prosecutor returned by the API.
 * @param appMode - The current app-mode feature flag value.
 * @returns The mode-specific identifier, if supplied by the API.
 */
export const getProsecutorIdentifier = (
  prosecutor: IOpalFinesProsecutor,
  appMode: unknown,
): string | number | undefined => (appMode === 'opal' ? prosecutor.prosecutor_code : prosecutor.prosecutor_id);
