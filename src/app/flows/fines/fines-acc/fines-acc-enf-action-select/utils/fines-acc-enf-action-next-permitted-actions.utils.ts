/**
 * Normalises a comma-separated next enforcement action payload into action ids.
 */
export const getNextPermittedActionIds = (nextEnforcementActionData: string | null | undefined): string[] => {
  return (
    nextEnforcementActionData
      ?.split(',')
      .map((actionId) => actionId.trim())
      .filter(Boolean) ?? []
  );
};
