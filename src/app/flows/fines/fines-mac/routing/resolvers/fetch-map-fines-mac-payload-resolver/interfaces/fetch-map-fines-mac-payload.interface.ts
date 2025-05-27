import { IOpalFinesCourtRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-court-ref-data.interface';
import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacAddAccountPayload } from '../../../../services/fines-mac-payload/interfaces/fines-mac-payload-add-account.interfaces';
import { IOpalFinesMajorCreditorRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-major-creditor-ref-data.interface';
import { IOpalFinesLocalJusticeAreaRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-local-justice-area-ref-data.interface';
import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';

export interface IFetchMapFinesMacPayload {
  finesMacState: IFinesMacState;
  finesMacDraft: IFinesMacAddAccountPayload;
  courts: IOpalFinesCourtRefData;
  majorCreditors: IOpalFinesMajorCreditorRefData;
  localJusticeAreas: IOpalFinesLocalJusticeAreaRefData;
  results: IOpalFinesResultsRefData;
}
