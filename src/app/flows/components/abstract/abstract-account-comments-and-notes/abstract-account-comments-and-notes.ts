import { FormGroup, FormControl } from '@angular/forms';
import { AbstractFormBaseComponent } from '@components/abstract/abstract-form-base/abstract-form-base.component';

export abstract class AbstractAccountCommentsAndNotesComponent extends AbstractFormBaseComponent {
  protected setupForm(prefix: string): void {
    this.form = new FormGroup({
      [`${prefix}_account_comments_notes_comments`]: new FormControl<string | null>(null),
      [`${prefix}_account_comments_notes_notes`]: new FormControl<string | null>(null),
    });
  }
}
