import { ChangeDetectionStrategy, Component, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EMPTY, Observable } from 'rxjs';

import { GovukAccordionComponent, GovukButtonComponent } from '@components';
import { GovukButtonClasses } from '@enums';
import { DefendantAccountService } from '@services';
import { IDefendantAccount } from '@interfaces';

@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [CommonModule, GovukButtonComponent, GovukAccordionComponent],
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestPageComponent {
  private defendantAccountService = inject(DefendantAccountService);
  public data$: Observable<IDefendantAccount> = EMPTY;

  public handleFetchApiButtonClick(): void {
    this.data$ = this.defendantAccountService.getDefendantAccount({
      businessUnitId: 1,
      accountNumber: '1212',
    });
  }
}
