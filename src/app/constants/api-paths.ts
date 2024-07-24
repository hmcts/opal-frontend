const baseUrl = '/api/';
const defendantAccountPath = 'defendant-account/';
const courtPath = 'court/';
const businessUnit = 'business-unit/';
const localJusticeArea = 'local-justice-area/';

export const API_PATHS = {
  defendantAccount: `${baseUrl}${defendantAccountPath}`,
  defendantAccountSearch: `${baseUrl}${defendantAccountPath}search`,
  defendantAccountAddNote: `${baseUrl}${defendantAccountPath}addNote`,
  defendantAccountNotes: `${baseUrl}${defendantAccountPath}notes`,
  courtSearch: `${baseUrl}${courtPath}search`,
  businessUnitRefData: `${baseUrl}${businessUnit}ref-data`,
  localJusticeAreaRefData: `${baseUrl}${localJusticeArea}ref-data`,
  courtRefData: `${baseUrl}${courtPath}ref-data`,
};
