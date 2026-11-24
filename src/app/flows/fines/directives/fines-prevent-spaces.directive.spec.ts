import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesPreventSpacesDirective } from './fines-prevent-spaces.directive';

@Component({
  standalone: true,
  imports: [FinesPreventSpacesDirective],
  template: '<input [appFinesPreventSpaces]="enabled" />',
})
class TestHostComponent {
  public enabled = true;
}

describe('FinesPreventSpacesDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let input: HTMLInputElement;

  const render = (enabled = true): void => {
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.enabled = enabled;
    fixture.detectChanges();
    input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
  });

  it('should prevent whitespace before text is inserted', () => {
    render();

    const event = new InputEvent('beforeinput', {
      bubbles: true,
      cancelable: true,
      inputType: 'insertText',
      data: ' ',
    });

    input.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it('should allow non-whitespace and non-text insertions', () => {
    render();

    const characterEvent = new InputEvent('beforeinput', {
      bubbles: true,
      cancelable: true,
      inputType: 'insertText',
      data: 'A',
    });
    const nonTextEvent = new InputEvent('beforeinput', {
      bubbles: true,
      cancelable: true,
      inputType: 'insertFromPaste',
      data: ' ',
    });
    const emptyDataEvent = new InputEvent('beforeinput', {
      bubbles: true,
      cancelable: true,
      inputType: 'insertText',
      data: null,
    });

    input.dispatchEvent(characterEvent);
    input.dispatchEvent(nonTextEvent);
    input.dispatchEvent(emptyDataEvent);

    expect(characterEvent.defaultPrevented).toBe(false);
    expect(nonTextEvent.defaultPrevented).toBe(false);
    expect(emptyDataEvent.defaultPrevented).toBe(false);
  });

  it('should prevent the space key but allow other keys', () => {
    render();

    const spaceEvent = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: ' ' });
    const otherKeyEvent = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'A' });

    input.dispatchEvent(spaceEvent);
    input.dispatchEvent(otherKeyEvent);

    expect(spaceEvent.defaultPrevented).toBe(true);
    expect(otherKeyEvent.defaultPrevented).toBe(false);
  });

  it('should prevent pasted whitespace but allow text without whitespace', () => {
    render();

    const whitespaceEvent = new Event('paste', { bubbles: true, cancelable: true });
    Object.defineProperty(whitespaceEvent, 'clipboardData', {
      value: { getData: () => 'REG 123' },
    });
    const textEvent = new Event('paste', { bubbles: true, cancelable: true });
    Object.defineProperty(textEvent, 'clipboardData', {
      value: { getData: () => 'REG123' },
    });
    const missingClipboardEvent = new Event('paste', { bubbles: true, cancelable: true });

    input.dispatchEvent(whitespaceEvent);
    input.dispatchEvent(textEvent);
    input.dispatchEvent(missingClipboardEvent);

    expect(whitespaceEvent.defaultPrevented).toBe(true);
    expect(textEvent.defaultPrevented).toBe(false);
    expect(missingClipboardEvent.defaultPrevented).toBe(false);
  });

  it('should allow spaces in beforeinput, keydown, and paste when disabled', () => {
    render(false);

    const beforeInputEvent = new InputEvent('beforeinput', {
      bubbles: true,
      cancelable: true,
      inputType: 'insertText',
      data: ' ',
    });
    const keydownEvent = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: ' ' });
    const pasteEvent = new Event('paste', { bubbles: true, cancelable: true });
    Object.defineProperty(pasteEvent, 'clipboardData', {
      value: { getData: () => 'REG 123' },
    });

    input.dispatchEvent(beforeInputEvent);
    input.dispatchEvent(keydownEvent);
    input.dispatchEvent(pasteEvent);

    expect(beforeInputEvent.defaultPrevented).toBe(false);
    expect(keydownEvent.defaultPrevented).toBe(false);
    expect(pasteEvent.defaultPrevented).toBe(false);
  });
});
