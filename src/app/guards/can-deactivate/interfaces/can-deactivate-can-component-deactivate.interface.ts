import { UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

export type CanDeactivateCanDeactivateType =
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree;

export interface ICanDeactivateCanComponentDeactivate {
  canDeactivate: () => CanDeactivateCanDeactivateType;
}
