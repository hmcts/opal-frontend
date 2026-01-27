export type LegacyOpalResponseType = 'text' | 'json';

export interface IOpalLegacyOpalRequestOptions {
  accept?: string;
  responseType?: LegacyOpalResponseType;
  parseXmlToJson?: boolean;
}
