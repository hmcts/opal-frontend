import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMacAliasRowComponent } from './fines-mac-alias-row.component';

describe('FinesMacAliasRowComponent', () => {
  let component: FinesMacAliasRowComponent;
  let fixture: ComponentFixture<FinesMacAliasRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacAliasRowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacAliasRowComponent);
    component = fixture.componentInstance;
  });

  it('should display the numbered alias heading when multiple aliases exist', () => {
    fixture.componentRef.setInput('index', 1);
    fixture.componentRef.setInput('total', 3);
    fixture.componentRef.setInput('releaseEnabled', true);
    fixture.detectChanges();

    const heading = fixture.nativeElement.querySelector('h2') as HTMLHeadingElement;

    expect(heading.textContent?.trim()).toBe('Alias 2 of 3');
  });

  it('should hide the Remove button when only one alias remains', () => {
    fixture.componentRef.setInput('index', 0);
    fixture.componentRef.setInput('total', 1);
    fixture.componentRef.setInput('releaseEnabled', true);
    fixture.detectChanges();

    const removeButton = fixture.nativeElement.querySelector('button.moj-add-another__remove-button');

    expect(removeButton).toBeNull();
  });

  it('should emit the selected alias index when Remove is clicked', () => {
    fixture.componentRef.setInput('index', 2);
    fixture.componentRef.setInput('total', 3);
    fixture.componentRef.setInput('releaseEnabled', true);

    const emitSpy = vi.spyOn(component.removeAlias, 'emit');

    fixture.detectChanges();

    const removeButton = fixture.nativeElement.querySelector(
      'button.moj-add-another__remove-button',
    ) as HTMLButtonElement;

    removeButton.click();

    expect(emitSpy).toHaveBeenCalledExactlyOnceWith(2);
  });

  it('should preserve the legacy heading and hide Remove when release is disabled', () => {
    fixture.componentRef.setInput('index', 0);
    fixture.componentRef.setInput('total', 3);
    fixture.componentRef.setInput('releaseEnabled', false);
    fixture.detectChanges();

    const heading = fixture.nativeElement.querySelector('h2') as HTMLHeadingElement;

    expect(heading.textContent?.trim()).toBe('Alias 1');
    expect(fixture.nativeElement.querySelector('button.moj-add-another__remove-button')).toBeNull();
  });
});
