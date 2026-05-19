/**
 * Normalises a comma-separated next enforcement action payload into action ids.
 * Returns null when the payload only contains the optional all-permitted action id.
 */
export const getNextPermittedActionIds = (
  nextEnforcementActionData: string | null | undefined,
  allPermittedActionId?: string,
): string[] | null => {
  const actionIds =
    nextEnforcementActionData
      ?.split(',')
      .map((actionId) => actionId.trim())
      .filter(Boolean) ?? [];

  if (
    allPermittedActionId &&
    actionIds.length === 1 &&
    actionIds[0].toLowerCase() === allPermittedActionId.toLowerCase()
  ) {
    return null;
  }

  return actionIds;
};
