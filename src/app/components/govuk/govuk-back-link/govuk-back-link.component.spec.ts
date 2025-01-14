import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukBackLinkComponent } from './govuk-back-link.component';

describe('GovukBackLinkComponent', () => {
  let component: GovukBackLinkComponent | null;
  let fixture: ComponentFixture<GovukBackLinkComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukBackLinkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukBackLinkComponent);
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

  it('should call preventDefault and emit event when onBack is called', () => {
    if (!component) {
      fail('component returned null');
      return;
    }
    const event = jasmine.createSpyObj(Event, ['preventDefault']);
    spyOn(component.clickEvent, 'emit');

    component.onBack(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.clickEvent.emit).toHaveBeenCalledWith(event);
  });
});
