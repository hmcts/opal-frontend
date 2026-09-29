export enum InterfaceFileViewerFileType {
  BteckohReport = 'BTECKOH_REPORT',
  CapsReport = 'CAPS_REPORT',
  Opal = 'OPAL',
  Natwest = 'NATWEST',
  Allpay = 'ALLPAY',
  AllpayDd = 'ALLPAY_DD',
  Barclaycard = 'BARCLAYCARD',
  Bteckoh = 'BTECKOH',
  Dwp = 'DWP',
  Cder = 'CDER',
  Jacobs = 'JACOBS',
  Marston = 'MARSTON',
  Other = 'OTHER',
  VariantBanking = 'VARIANT_BANKING',
}

export enum InterfaceFileViewerFileSource {
  Source = 'SOURCE',
  SourceJson = 'SOURCE_JSON',
  TransformedJson = 'TRANSFORMED_JSON',
}

export enum InterfaceFileViewerSupportedDomain {
  Fines = 'FINES',
  Confiscation = 'CONFISCATION',
  Maintenance = 'MAINTENANCE',
  FileHandler = 'FILE_HANDLER',
}

export enum InterfaceFileViewerFileStatus {
  Duplicate = 'DUPLICATE',
  Ingested = 'INGESTED',
  Success = 'SUCCESS',
  SuccessNoTransactions = 'SUCCESS_NO_TRANSACTIONS',
  Superseded = 'SUPERSEDED',
  Failed = 'FAILED',
  FailedSuperseded = 'FAILED_SUPERSEDED',
}
