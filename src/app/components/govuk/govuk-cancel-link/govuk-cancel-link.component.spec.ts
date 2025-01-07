import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukCancelLinkComponent } from './govuk-cancel-link.component';

describe('GovukCancelLinkComponent', () => {
  let component: GovukCancelLinkComponent | null;
  let fixture: ComponentFixture<GovukCancelLinkComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukCancelLinkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukCancelLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterAll(() => {
    fixture = null;
    component = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle the click', () => {
    if (!component || !fixture) {
      fail('component or fixture returned null');
      return;
    }

    spyOn(component.linkClickEvent, 'emit');

    component.handleClick();

    fixture.detectChanges();

    expect(component.linkClickEvent.emit).toHaveBeenCalledWith(true);
  });
});
