import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appFinesPreventSpaces]',
  standalone: true,
})
export class FinesPreventSpacesDirective {
  @HostListener('beforeinput', ['$event'])
  public preventSpaceInput(event: InputEvent): void {
    if (event.inputType === 'insertText' && /\s/.test(event.data ?? '')) event.preventDefault();
  }

  @HostListener('keydown', ['$event'])
  public preventSpaceKey(event: KeyboardEvent): void {
    if (event.key === ' ') event.preventDefault();
  }

  @HostListener('paste', ['$event'])
  public preventSpacesInPaste(event: ClipboardEvent): void {
    if (/\s/.test(event.clipboardData?.getData('text') ?? '')) event.preventDefault();
  }
}
