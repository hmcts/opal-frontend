import { ITransformItem } from '@services/transformation-service/interfaces/transform-item.interface';

export const FINES_MAC_TRANSFORM_ITEMS_CONFIG: ITransformItem[] = [
  {
    key: 'dob',
    transformType: 'date',
    dateInputFormat: 'dd/MM/yyyy',
    dateOutputFormat: 'yyyy-MM-dd',
  },
  {
    key: 'effective_date',
    transformType: 'date',
    dateInputFormat: 'dd/MM/yyyy',
    dateOutputFormat: 'yyyy-MM-dd',
  },
  {
    key: 'collection_order_date',
    transformType: 'date',
    dateInputFormat: 'dd/MM/yyyy',
    dateOutputFormat: 'yyyy-MM-dd',
  },
  {
    key: 'suspended_committal_date',
    transformType: 'date',
    dateInputFormat: 'dd/MM/yyyy',
    dateOutputFormat: 'yyyy-MM-dd',
  },
  {
    key: 'account_sentence_date',
    transformType: 'date',
    dateInputFormat: 'dd/MM/yyyy',
    dateOutputFormat: 'yyyy-MM-dd',
  },
];
