import { inject } from '@angular/core';
import { FinesAccountStore } from '../../../stores/fines-acc.store';
import { buildFetchCourtsResolver } from '../../../../routing/resolvers/fetch-courts-resolver/fetch-courts.resolver';

export const fetchAccCourtsResolver = buildFetchCourtsResolver(() =>
  Number(inject(FinesAccountStore).business_unit_id()),
);
