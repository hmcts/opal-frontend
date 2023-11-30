import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  // TODO: Account enquiry state interface
  public accountEnquiry = signal({});
}
