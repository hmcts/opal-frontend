import { IOpalFinesPaths } from '@services/fines/opal-fines-service/interfaces/opal-fines-paths.interface';

const baseUrl = '/opal-fines-service/';
const defendantAccountPath = 'defendant-accounts/';
const courtPath = 'courts/';
const businessUnit = 'business-units/';
const localJusticeArea = 'local-justice-areas/';

export const OPAL_FINES_PATHS: IOpalFinesPaths = {
  defendantAccount: `${baseUrl}${defendantAccountPath}`,
  defendantAccountSearch: `${baseUrl}${defendantAccountPath}search`,
  defendantAccountAddNote: `${baseUrl}${defendantAccountPath}addNote`,
  defendantAccountNotes: `${baseUrl}${defendantAccountPath}notes`,
  courtSearch: `${baseUrl}${courtPath}search`,
  businessUnitRefData: `${baseUrl}${businessUnit}ref-data`,
  localJusticeAreaRefData: `${baseUrl}${localJusticeArea}ref-data`,
  courtRefData: `${baseUrl}${courtPath}ref-data`,
};
