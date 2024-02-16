const baseUrl = '/api/';
const defendantAccountPath = 'defendant-account/';

export enum ApiPaths {
  defendantAccount = `${baseUrl}${defendantAccountPath}`,
  defendantAccountSearch = `${baseUrl}${defendantAccountPath}search`,
  defendantAccountAddNote = `${baseUrl}${defendantAccountPath}addNote`,
  defendantAccountNotes = `${baseUrl}${defendantAccountPath}notes`,
}
