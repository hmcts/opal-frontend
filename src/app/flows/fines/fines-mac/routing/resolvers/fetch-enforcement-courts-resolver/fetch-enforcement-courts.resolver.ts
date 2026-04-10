import { inject } from '@angular/core';
import { FinesMacStore } from '../../../stores/fines-mac.store';
import { buildFetchCourtsResolver } from '../../../../routing/resolvers/fetch-courts-resolver/fetch-courts.resolver';

export const fetchEnforcementCourtsResolver = buildFetchCourtsResolver(
  () => inject(FinesMacStore).businessUnit().business_unit_id,
);
