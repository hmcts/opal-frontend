import { TemplateRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { BackLinkService } from './back-link.service';

describe('BackLinkService', () => {
  let service: BackLinkService;
  let templateRef: TemplateRef<unknown>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackLinkService);
    templateRef = {} as TemplateRef<unknown>;
  });

  it('should initially expose no template', () => {
    expect(service.templateRef()).toBeNull();
  });

  it('should expose the registered template', () => {
    service.setTemplate(templateRef);

    expect(service.templateRef()).toBe(templateRef);
  });

  it('should clear the registered template', () => {
    service.setTemplate(templateRef);

    service.clearTemplate(templateRef);

    expect(service.templateRef()).toBeNull();
  });

  it('should not clear a newer template when an older template is destroyed', () => {
    const newerTemplateRef = {} as TemplateRef<unknown>;
    service.setTemplate(templateRef);
    service.setTemplate(newerTemplateRef);

    service.clearTemplate(templateRef);

    expect(service.templateRef()).toBe(newerTemplateRef);
  });
});
