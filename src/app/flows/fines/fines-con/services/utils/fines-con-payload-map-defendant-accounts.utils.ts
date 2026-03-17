import { IOpalFinesDefendantAccountAlias } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account-alias.interface';
import { IFinesConSearchResultDefendantAccount } from '../../consolidate-acc/fines-con-search-result/interfaces/fines-con-search-result-defendant-account.interface';
import { IFinesConSearchResultAccountCheck } from '../../consolidate-acc/fines-con-search-result/interfaces/fines-con-search-result-account-check.interface';
import { IFinesConSearchResultDefendantTableWrapperTableData } from '../../consolidate-acc/fines-con-search-result/fines-con-search-result-defendant-table-wrapper/interfaces/fines-con-search-result-defendant-table-wrapper-table-data.interface';
import { FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_TABLE_DATA_EMPTY } from '../../consolidate-acc/fines-con-search-result/fines-con-search-result-defendant-table-wrapper/constants/fines-con-search-result-defendant-table-wrapper-table-data-empty.constant';

type IRawDefendantAccount = IFinesConSearchResultDefendantAccount & {
  defendantAccountId?: number | string | null;
  accountNumber?: string | null;
  defendantSurname?: string | null;
  defendantFirstnames?: string | null;
  birthDate?: string | null;
  addressLine1?: string | null;
  postCode?: string | null;
  collectionOrder?: boolean | null;
  has_collection_order?: boolean | null;
  hasCollectionOrder?: boolean | null;
  lastEnforcement?: string | null;
  lastEnforcementAction?: string | null;
  accountBalance?: number | null;
  hasPayingParentGuardian?: boolean | null;
  nationalInsuranceNumber?: string | null;
  prosecutorCaseReference?: string | null;
};

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

const formatName = (surname: string | null, forenames: string | null): string | null => {
  if (!surname && !forenames) {
    return null;
  }

  const surnameText = surname ? surname.toUpperCase() : '';
  const forenamesText = forenames ?? '';
  const separator = surname && forenames ? ', ' : '';

  return `${surnameText}${separator}${forenamesText}`;
};

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

const mapAccountChecks = (account: IFinesConSearchResultDefendantAccount): IFinesConSearchResultAccountCheck[] => {
  if (!account.checks) {
    return [];
  }

  return [...mapCheckArray(account.checks.errors, 'error'), ...mapCheckArray(account.checks.warnings, 'warning')];
};

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

export const mapDefendantAccounts = (
  defendantAccounts: IFinesConSearchResultDefendantAccount[],
): IFinesConSearchResultDefendantTableWrapperTableData[] => {
  return defendantAccounts.map((defendantAccount) => {
    const account = defendantAccount as IRawDefendantAccount;

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
      CO:
        (account.collection_order ??
          account.collectionOrder ??
          account.has_collection_order ??
          account.hasCollectionOrder) === true
          ? 'Y'
          : '-',
      ENF:
        account.last_enforcement ??
        account.lastEnforcement ??
        account.last_enforcement_action ??
        account.lastEnforcementAction ??
        null,
      Balance: account.account_balance ?? account.accountBalance ?? null,
      'P/G': (account.has_paying_parent_guardian ?? account.hasPayingParentGuardian) === true ? 'Y' : '-',
      'NI number': account.national_insurance_number ?? account.nationalInsuranceNumber ?? null,
      Ref: account.prosecutor_case_reference ?? account.prosecutorCaseReference ?? null,
    };
  });
};

export const buildChecksByAccountId = (
  defendantAccounts: IFinesConSearchResultDefendantAccount[],
): Record<number, IFinesConSearchResultAccountCheck[]> => {
  return defendantAccounts.reduce<Record<number, IFinesConSearchResultAccountCheck[]>>((acc, account) => {
    const rawAccount = account as IRawDefendantAccount;
    const accountId = normaliseAccountId(rawAccount.defendant_account_id ?? rawAccount.defendantAccountId);

    if (accountId === null) {
      return acc;
    }

    acc[accountId] = mapAccountChecks(account);
    return acc;
  }, {});
};
