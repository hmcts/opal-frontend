import { UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

export type CanDeactivateTypes = Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;
