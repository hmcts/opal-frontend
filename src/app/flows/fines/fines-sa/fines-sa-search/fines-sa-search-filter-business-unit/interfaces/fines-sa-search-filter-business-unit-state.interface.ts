export interface IFinesSaSearchFilterBusinessUnitState {
  fsa_search_account_business_unit_ids: Record<number, boolean>[] | null;
  fsa_search_account_business_unit_ids_fines_select_all: boolean | null;
  fsa_search_account_business_unit_ids_confiscation_select_all: boolean | null;
}
