import { ChangeDetectionStrategy, Component, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GovukAccordionComponent, GovukButtonComponent } from '@components';
import { GovukButtonClasses } from '@enums';
import { TestServiceService } from '@services';
import { EMPTY, Observable } from 'rxjs';

@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [CommonModule, GovukButtonComponent, GovukAccordionComponent],
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestPageComponent {
  private testService = inject(TestServiceService);
  public data$: Observable<any> = EMPTY;
  public testButtonStyleSig: WritableSignal<keyof typeof GovukButtonClasses> = signal('default');

  public handleClassChangeClick(): void {
    this.testButtonStyleSig.set('warning');
  }

  public handleFetchApiButtonClick(event: boolean): void {
    this.data$ = this.testService.fetchTodo(1);
  }
}
