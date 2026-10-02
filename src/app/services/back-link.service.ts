import { Injectable, TemplateRef, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BackLinkService {
  private readonly template = signal<TemplateRef<unknown> | null>(null);

  public readonly templateRef = this.template.asReadonly();

  public setTemplate(templateRef: TemplateRef<unknown>): void {
    this.template.set(templateRef);
  }

  public clearTemplate(templateRef: TemplateRef<unknown>): void {
    if (this.template() === templateRef) {
      this.template.set(null);
    }
  }
}
