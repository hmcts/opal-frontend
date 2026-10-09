import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { BackLinkService } from '../services/back-link.service';
import { BackLinkDirective } from './back-link.directive';

@Component({
  standalone: true,
  imports: [BackLinkDirective],
  template: `
    @if (showBackLink) {
      <ng-template appBackLink>Back</ng-template>
    }
  `,
})
class TestHostComponent {
  public showBackLink = true;
}

describe('BackLinkDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let backLinkService: BackLinkService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    backLinkService = TestBed.inject(BackLinkService);
  });

  it('should register its template when initialised', () => {
    fixture.detectChanges();

    expect(backLinkService.templateRef()).not.toBeNull();
  });

  it('should clear its template when destroyed', () => {
    fixture.detectChanges();

    fixture.componentInstance.showBackLink = false;
    fixture.detectChanges();

    expect(backLinkService.templateRef()).toBeNull();
  });
});
