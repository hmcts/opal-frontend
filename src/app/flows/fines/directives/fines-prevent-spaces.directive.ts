import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appFinesPreventSpaces]',
  standalone: true,
})
export class FinesPreventSpacesDirective {
  @Input() public appFinesPreventSpaces = true;

  @HostListener('beforeinput', ['$event'])
  public preventSpaceInput(event: InputEvent): void {
    if (this.appFinesPreventSpaces && event.inputType === 'insertText' && /\s/.test(event.data ?? '')) {
      event.preventDefault();
    }
  }

  @HostListener('keydown', ['$event'])
  public preventSpaceKey(event: KeyboardEvent): void {
    if (this.appFinesPreventSpaces && event.key === ' ') event.preventDefault();
  }

  @HostListener('paste', ['$event'])
  public preventSpacesInPaste(event: ClipboardEvent): void {
    if (this.appFinesPreventSpaces && /\s/.test(event.clipboardData?.getData('text') ?? '')) event.preventDefault();
  }
}
