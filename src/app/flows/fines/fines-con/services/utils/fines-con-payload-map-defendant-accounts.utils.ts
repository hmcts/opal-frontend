import { IOpalFinesDefendantAccountAlias } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account-alias.interface';
import { IFinesConSearchResultDefendantAccount } from '../../consolidate-acc/fines-con-search-result/interfaces/fines-con-search-result-defendant-account.interface';
import { IFinesConSearchResultAccountCheck } from '../../consolidate-acc/fines-con-search-result/interfaces/fines-con-search-result-account-check.interface';
import { IFinesConSearchResultDefendantTableWrapperTableData } from '../../consolidate-acc/fines-con-search-result/fines-con-search-result-defendant-table-wrapper/interfaces/fines-con-search-result-defendant-table-wrapper-table-data.interface';
import { FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_TABLE_DATA_EMPTY } from '../../consolidate-acc/fines-con-search-result/fines-con-search-result-defendant-table-wrapper/constants/fines-con-search-result-defendant-table-wrapper-table-data-empty.constant';
import { IFinesConPayloadRawDefendantAccount } from './interfaces/fines-con-payload-raw-defendant-account.interface';

/**
 * Normalises account IDs from number or digit-only string values.
 */
const normaliseAccountId = (value: number | string | null | undefined): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && /^\d+$/.test(value)) {
    const parsed = Number(value);
    return Number.isSafeInteger(parsed) ? parsed : null;
  }

  return null;
};

/**
 * Formats defendant name as "SURNAME, Forenames".
 */
const formatName = (surname: string | null, forenames: string | null): string | null => {
  if (!surname && !forenames) {
    return null;
  }

  const surnameText = surname ? surname.toUpperCase() : '';
  const forenamesText = forenames ?? '';
  const separator = surname && forenames ? ', ' : '';

  return `${surnameText}${separator}${forenamesText}`;
};

/**
 * Sorts aliases by alias number and formats each alias on a new line.
 */
const formatAliases = (aliases: IOpalFinesDefendantAccountAlias[] | null): string | null => {
  if (!aliases?.length) {
    return null;
  }

  const orderedAliases = [...aliases].sort(
    (a, b) => (a.alias_number ?? Number.MAX_SAFE_INTEGER) - (b.alias_number ?? Number.MAX_SAFE_INTEGER),
  );

  const aliasText = orderedAliases
    .map((alias) => formatName(alias.surname, alias.forenames))
    .filter((alias): alias is string => alias !== null);

  return aliasText.length > 0 ? aliasText.join('\n') : null;
};

/**
 * Resolves whether collection order is present across supported API shapes.
 */
const hasCollectionOrder = (account: IFinesConPayloadRawDefendantAccount): boolean => {
  return (
    (account.collection_order ??
      account.collectionOrder ??
      account.has_collection_order ??
      account.hasCollectionOrder) === true
  );
};

/**
 * Resolves the latest enforcement value across supported API shapes.
 */
const getLastEnforcement = (account: IFinesConPayloadRawDefendantAccount): string | null => {
  return (
    account.last_enforcement ??
    account.lastEnforcement ??
    account.last_enforcement_action ??
    account.lastEnforcementAction ??
    null
  );
};

/**
 * Maps raw check entries into normalised check models by severity.
 */
const mapCheckArray = (
  checks: Array<{ reference?: string; message?: string }> | undefined,
  severity: 'error' | 'warning',
): IFinesConSearchResultAccountCheck[] => {
  if (!checks?.length) {
    return [];
  }

  return checks.flatMap((item) => {
    const reference = item.reference?.trim() ?? '';
    const message = item.message?.trim() ?? '';

    if (!reference || !message) {
      return [];
    }

    return [
      {
        reference,
        severity,
        message,
      },
    ];
  });
};

/**
 * Combines account errors and warnings into a single checks array.
 */
const mapAccountChecks = (account: IFinesConSearchResultDefendantAccount): IFinesConSearchResultAccountCheck[] => {
  if (!account.checks) {
    return [];
  }

  return [...mapCheckArray(account.checks.errors, 'error'), ...mapCheckArray(account.checks.warnings, 'warning')];
};

/**
 * Extracts defendant accounts from array, keyed object, or API response wrapper.
 */
export const extractDefendantAccounts = (response: unknown): IFinesConSearchResultDefendantAccount[] => {
  if (Array.isArray(response)) {
    return response as IFinesConSearchResultDefendantAccount[];
  }

  if (!response || typeof response !== 'object') {
    return [];
  }

  const responseWithAliases = response as {
    defendant_accounts?: unknown;
    defendantAccounts?: unknown;
  };

  const source = responseWithAliases.defendant_accounts ?? responseWithAliases.defendantAccounts ?? [];

  if (Array.isArray(source)) {
    return source as IFinesConSearchResultDefendantAccount[];
  }

  if (source && typeof source === 'object') {
    return Object.values(source).filter(
      (item): item is IFinesConSearchResultDefendantAccount => !!item && typeof item === 'object',
    );
  }

  return [];
};

/**
 * Maps defendant accounts into table row data with fallback field support.
 */
export const mapDefendantAccounts = (
  defendantAccounts: IFinesConSearchResultDefendantAccount[],
): IFinesConSearchResultDefendantTableWrapperTableData[] => {
  return defendantAccounts.map((defendantAccount) => {
    const account = defendantAccount as IFinesConPayloadRawDefendantAccount;

    return {
      ...FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_TABLE_DATA_EMPTY,
      'Account ID': normaliseAccountId(account.defendant_account_id ?? account.defendantAccountId ?? null),
      Account: account.account_number ?? account.accountNumber ?? null,
      Name: formatName(
        account.defendant_surname ?? account.defendantSurname ?? null,
        account.defendant_firstnames ?? account.defendantFirstnames ?? null,
      ),
      Aliases: formatAliases(account.aliases),
      'Date of birth': account.birth_date ?? account.birthDate ?? null,
      'Address line 1': account.address_line_1 ?? account.addressLine1 ?? null,
      Postcode: account.postcode ?? account.postCode ?? null,
      CO: hasCollectionOrder(account) ? 'Y' : '-',
      ENF: getLastEnforcement(account),
      Balance: account.account_balance ?? account.accountBalance ?? null,
      'P/G': (account.has_paying_parent_guardian ?? account.hasPayingParentGuardian) === true ? 'Y' : '-',
      'NI number': account.national_insurance_number ?? account.nationalInsuranceNumber ?? null,
      Ref: account.prosecutor_case_reference ?? account.prosecutorCaseReference ?? null,
    };
  });
};

/**
 * Builds a map of account checks keyed by normalised defendant account ID.
 */
export const buildChecksByAccountId = (
  defendantAccounts: IFinesConSearchResultDefendantAccount[],
): Record<number, IFinesConSearchResultAccountCheck[]> => {
  return defendantAccounts.reduce<Record<number, IFinesConSearchResultAccountCheck[]>>((acc, account) => {
    const rawAccount = account as IFinesConPayloadRawDefendantAccount;
    const accountId = normaliseAccountId(rawAccount.defendant_account_id ?? rawAccount.defendantAccountId);

    if (accountId === null) {
      return acc;
    }

    acc[accountId] = mapAccountChecks(account);
    return acc;
  }, {});
};
