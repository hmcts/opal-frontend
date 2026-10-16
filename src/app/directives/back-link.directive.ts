import { Directive, OnDestroy, OnInit, TemplateRef, inject } from '@angular/core';
import { BackLinkService } from '../services/back-link.service';

@Directive({
  selector: 'ng-template[appBackLink]',
})
export class BackLinkDirective implements OnInit, OnDestroy {
  private readonly backLinkService = inject(BackLinkService);
  private readonly templateRef = inject(TemplateRef<unknown>);

  public ngOnInit(): void {
    this.backLinkService.setTemplate(this.templateRef);
  }

  public ngOnDestroy(): void {
    this.backLinkService.clearTemplate(this.templateRef);
  }
}
