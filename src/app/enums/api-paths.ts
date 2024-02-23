const baseUrl = '/api/';
const defendantAccountPath = 'defendant-account/';
const courtPath = 'court/';

export enum ApiPaths {
  defendantAccount = `${baseUrl}${defendantAccountPath}`,
  defendantAccountSearch = `${baseUrl}${defendantAccountPath}search`,
  defendantAccountAddNote = `${baseUrl}${defendantAccountPath}addNote`,
  defendantAccountNotes = `${baseUrl}${defendantAccountPath}notes`,
  courtSearch = `${baseUrl}${courtPath}search`,
}
