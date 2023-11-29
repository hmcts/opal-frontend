import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { EMPTY, Observable } from 'rxjs';

import { GovukButtonComponent } from '@components';
import { DefendantAccountService } from '@services';
import { IDefendantAccount } from '@interfaces';

@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [CommonModule, GovukButtonComponent],
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestPageComponent {
  private readonly document = inject(DOCUMENT);
  private readonly defendantAccountService = inject(DefendantAccountService);
  public data$: Observable<IDefendantAccount> = EMPTY;

  public handleLogoutApiButtonClick(): void {
    this.document.location.href = '/sso/logout';
  }

  public handleFetchApiButtonClick(): void {
    this.data$ = this.defendantAccountService.getDefendantAccount({
      businessUnitId: 1,
      accountNumber: '1212',
    });
  }
}
