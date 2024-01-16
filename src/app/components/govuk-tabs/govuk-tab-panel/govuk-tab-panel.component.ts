import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { UtilsService } from '@services';

@Component({
  selector: 'app-govuk-tab-panel',
  standalone: true,
  imports: [],
  templateUrl: './govuk-tab-panel.component.html',
  styleUrl: './govuk-tab-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukTabPanelComponent {
  private readonly utilService = inject(UtilsService);
  public _tabsPanelId!: string;

  @Input({ required: true }) public tabsId!: string;
  @Input({ required: true }) set tabsPanelId(tabsPanelId: string) {
    this._tabsPanelId = this.utilService.upperCaseFirstLetter(tabsPanelId);
  }
}
