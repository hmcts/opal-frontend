import { ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OpalFines } from '../services/opal-fines-service/opal-fines.service';
import { FinesDraftStore } from './stores/fines-draft.store';

@Component({
  selector: 'app-fines-draft',
  imports: [RouterOutlet],
  templateUrl: './fines-draft.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesDraftComponent implements OnDestroy {
  private readonly opalFines = inject(OpalFines);
  private readonly finesDraftStore = inject(FinesDraftStore);

  public ngOnDestroy(): void {
    this.opalFines.clearDraftAccountsCache();
    this.finesDraftStore.resetFineDraftState();
    this.finesDraftStore.resetFragmentAndAmend();
    this.finesDraftStore.resetFragmentAndChecker();
    this.finesDraftStore.resetBannerMessage();
  }
}
