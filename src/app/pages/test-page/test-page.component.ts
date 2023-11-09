import { ChangeDetectionStrategy, Component, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GovukAccordionComponent, GovukButtonComponent } from '@components';
import { GovukButtonClasses } from '@enums';

@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [CommonModule, GovukButtonComponent, GovukAccordionComponent],
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestPageComponent {
  public testButtonStyleSig: WritableSignal<keyof typeof GovukButtonClasses> = signal('default');

  public handleClassChangeClick(): void {
    this.testButtonStyleSig.set('warning');
  }
}
