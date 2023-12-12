import { Injectable, WritableSignal, signal } from '@angular/core';
import { IAccountEnquiryState } from '@interfaces';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  public error = signal({ error: false, message: '' });

  public accountEnquiry: WritableSignal<IAccountEnquiryState> = signal({
    search: null,
  });
}
