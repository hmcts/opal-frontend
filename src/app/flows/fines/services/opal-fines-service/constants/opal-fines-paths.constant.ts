import { IOpalFinesPaths } from '@services/fines/opal-fines-service/interfaces/opal-fines-paths.interface';

const baseUrl = '/opal-fines-service/';
const defendantAccountPath = 'defendant-accounts/';
const courtPath = 'courts';
const businessUnit = 'business-units';
const localJusticeArea = 'local-justice-areas';
const offences = 'offences';
const results = 'results';
const majorCreditor = 'major-creditors';

export const OPAL_FINES_PATHS: IOpalFinesPaths = {
  defendantAccount: `${baseUrl}${defendantAccountPath}`,
  defendantAccountSearch: `${baseUrl}${defendantAccountPath}search`,
  defendantAccountAddNote: `${baseUrl}${defendantAccountPath}addNote`,
  defendantAccountNotes: `${baseUrl}${defendantAccountPath}notes`,
  courtSearch: `${baseUrl}${courtPath}/search`,
  businessUnitRefData: `${baseUrl}${businessUnit}`,
  localJusticeAreaRefData: `${baseUrl}${localJusticeArea}`,
  courtRefData: `${baseUrl}${courtPath}`,
  offencesRefData: `${baseUrl}${offences}`,
  resultsRefData: `${baseUrl}${results}`,
  majorCreditorRefData: `${baseUrl}${majorCreditor}`,
};
