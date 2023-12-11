import { Injectable, WritableSignal, signal } from '@angular/core';
import { IAccountEnquiryState } from '@interfaces';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  public accountEnquiry: WritableSignal<IAccountEnquiryState> = signal({});
}
