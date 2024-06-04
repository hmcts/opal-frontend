import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukCancelLinkComponent } from './govuk-cancel-link.component';

describe('GovukCancelLinkComponent', () => {
  let component: GovukCancelLinkComponent;
  let fixture: ComponentFixture<GovukCancelLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukCancelLinkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukCancelLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle the click', () => {
    spyOn(component.linkClickEvent, 'emit');

    component.handleClick();

    fixture.detectChanges();

    expect(component.linkClickEvent.emit).toHaveBeenCalledWith(true);
  });
});
