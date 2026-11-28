/** Converts an autocomplete value into a numeric business unit ID for report requests. */
export const getFinesReportsBusinessUnitId = (value: string | null | undefined): number | null => {
  const businessUnitId = Number(value);

  return Number.isInteger(businessUnitId) && businessUnitId > 0 ? businessUnitId : null;
};
