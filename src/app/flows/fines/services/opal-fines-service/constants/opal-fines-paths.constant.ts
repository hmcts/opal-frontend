import { IOpalFinesPaths } from '@services/fines/opal-fines-service/interfaces/opal-fines-paths.interface';

const baseUrl = '/opal-fines-service/';
const courtPath = 'courts';
const businessUnit = 'business-units';
const localJusticeArea = 'local-justice-areas';
const offences = 'offences';
const results = 'results';
const majorCreditor = 'major-creditors';
const draftAccounts = 'draft-accounts';

export const OPAL_FINES_PATHS: IOpalFinesPaths = {
  businessUnitRefData: `${baseUrl}${businessUnit}`,
  localJusticeAreaRefData: `${baseUrl}${localJusticeArea}`,
  courtRefData: `${baseUrl}${courtPath}`,
  offencesRefData: `${baseUrl}${offences}`,
  resultsRefData: `${baseUrl}${results}`,
  majorCreditorRefData: `${baseUrl}${majorCreditor}`,
  draftAccounts: `${baseUrl}${draftAccounts}`,
};
