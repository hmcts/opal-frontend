import { IOpalFinesPaths } from '@services/fines/opal-fines-service/interfaces/opal-fines-paths.interface';

const baseUrl = '/opal-fines-service/';
const courtPath = 'courts';
const courtFees = 'court-fees';
const businessUnit = 'business-units';
const localJusticeArea = 'local-justice-areas';
const offences = 'offences';
const search = '/search';
const results = 'results';
const majorCreditor = 'major-creditors';
const majorCreditorAccounts = 'major-creditor-accounts';
const draftAccounts = 'draft-accounts';
const prosecutors = 'prosecutors';
const defendantAccounts = 'defendant-accounts';
const defendantAccountParties = 'defendant-account-parties';
const notes = 'notes';
const minorCreditorAccounts = 'minor-creditor-accounts';
const enforcers = 'enforcers';
const centralFunds = 'central-funds';
const reports = 'reports';
const reportInstances = 'report-instances';
const outstandingAutoPaymentCount = '/outstanding-auto-payment-count';
const interfaceJobs = 'interface-jobs';
const tills = 'tills';
const sourceMappings = 'mappings/source';
const summary = '/summary';
const process = '/process';

export const OPAL_FINES_PATHS: IOpalFinesPaths = {
  businessUnitRefData: `${baseUrl}${businessUnit}`,
  businessUnitOutstandingAutoPaymentCount: `${baseUrl}${businessUnit}${outstandingAutoPaymentCount}`,
  localJusticeAreaRefData: `${baseUrl}${localJusticeArea}`,
  courtRefData: `${baseUrl}${courtPath}`,
  courtFees: `${baseUrl}${courtFees}`,
  offencesRefData: `${baseUrl}${offences}`,
  resultsRefData: `${baseUrl}${results}`,
  majorCreditorRefData: `${baseUrl}${majorCreditor}`,
  draftAccounts: `${baseUrl}${draftAccounts}`,
  searchOffences: `${baseUrl}${offences}${search}`,
  prosecutorRefData: `${baseUrl}${prosecutors}`,
  defendantAccounts: `${baseUrl}${defendantAccounts}`,
  notes: `${baseUrl}${notes}`,
  searchDefendantAccounts: `${baseUrl}${defendantAccounts}${search}`,
  searchMinorCreditorAccounts: `${baseUrl}${minorCreditorAccounts}${search}`,
  minorCreditorAccounts: `${baseUrl}${minorCreditorAccounts}`,
  majorCreditorAccounts: `${baseUrl}${majorCreditorAccounts}`,
  enforcersRefData: `${baseUrl}${enforcers}`,
  reports: `${baseUrl}${reports}`,
  reportInstances: `${baseUrl}${reportInstances}`,
  interfaceJobs: `${baseUrl}${interfaceJobs}`,
  interfaceJobsSummary: `${baseUrl}${interfaceJobs}${summary}`,
  tills: `${baseUrl}${tills}`,
  sourceMappings: `${baseUrl}${sourceMappings}`,
  processInterfaceJobs: `${baseUrl}${interfaceJobs}${process}`,
  defendantAccountParties,
  centralFunds: `${baseUrl}${centralFunds}`,
};
