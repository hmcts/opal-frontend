import { FormControl, Validators } from '@angular/forms';

export const FINES_MAC_PERSONAL_DETAILS_CONTROLS_TITLE = {
  title: new FormControl(null, [Validators.required]),
};
