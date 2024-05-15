import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukBackLinkComponent } from './govuk-back-link.component';

describe('GovukBackLinkComponent', () => {
  let component: GovukBackLinkComponent;
  let fixture: ComponentFixture<GovukBackLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukBackLinkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukBackLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call preventDefault and window.history.back when onBack is called', () => {
    const event = jasmine.createSpyObj('event', ['preventDefault']);
    spyOn(window.history, 'back');

    component.onBack(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(window.history.back).toHaveBeenCalled();
  });
});
