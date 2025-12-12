import { ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OpalFines } from '../services/opal-fines-service/opal-fines.service';

@Component({
  selector: 'app-fines-draft',
  imports: [RouterOutlet],
  templateUrl: './fines-draft.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesDraftComponent implements OnDestroy {
  private readonly opalFines = inject(OpalFines);

  public ngOnDestroy(): void {
    this.opalFines.clearDraftAccountsCache();
  }
}
