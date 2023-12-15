import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { EMPTY, Observable } from 'rxjs';

import { GovukButtonComponent } from '@components';
import { DefendantAccountService, StateService } from '@services';
import { IDefendantAccount } from '@interfaces';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [CommonModule, GovukButtonComponent, RouterModule],
  providers: [DefendantAccountService],
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestPageComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly defendantAccountService = inject(DefendantAccountService);
  public data$: Observable<IDefendantAccount> = EMPTY;

  private readonly stateService = inject(StateService);

  public ngOnInit(): void {
    console.log(this.stateService.accountEnquiry());
  }

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
