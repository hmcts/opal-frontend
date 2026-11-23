export const stripTelephoneNumberSpaces = (value: string | null): string | null => value?.replace(/\s/g, '') ?? null;
