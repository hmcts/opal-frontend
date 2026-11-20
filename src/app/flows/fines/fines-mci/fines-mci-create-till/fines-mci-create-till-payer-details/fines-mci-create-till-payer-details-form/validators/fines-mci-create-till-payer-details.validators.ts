import { PAYER_TEXT_PATTERN } from '../constants/fines-mci-create-till-payer-details-patterns.constant';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';

export const PAYER_POSTCODE_PATTERN_VALIDATOR = patternValidator(PAYER_TEXT_PATTERN, 'alphanumericTextPattern');
