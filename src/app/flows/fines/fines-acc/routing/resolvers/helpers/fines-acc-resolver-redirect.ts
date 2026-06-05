import { RedirectCommand, Router } from '@angular/router';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS } from '../../constants/fines-acc-minor-creditor-routing-paths.constant';

/**
 * Creates a redirect command to the defendant details page
 * @param router - The Angular Router instance
 * @returns A RedirectCommand to the defendant details page
 */
export function createDefendantDetailsRedirect(router: Router): RedirectCommand {
  return new RedirectCommand(router.createUrlTree([FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details]));
}

/**
 * Creates a redirect command to the minor creditor details page
 * @param router - The Angular Router instance
 * @returns A RedirectCommand to the minor creditor details page
 */
export function amendMinorCreditorDetailsRedirect(router: Router): RedirectCommand {
  return new RedirectCommand(router.createUrlTree([FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children.details]));
}
