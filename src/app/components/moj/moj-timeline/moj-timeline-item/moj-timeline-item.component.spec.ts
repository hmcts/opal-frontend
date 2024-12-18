import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { MojTimelineItemComponent } from './moj-timeline-item.component';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <app-moj-timeline-item>
      <span title>Timeline Title</span>
      <span user>John Doe</span>
      <span date>2024-10-31</span>
      <span #description>Description of the event</span>
    </app-moj-timeline-item>
  `,
})
class TestHostComponent {}

@Component({
  template: `
    <app-moj-timeline-item>
      <span title>Timeline Title</span>
      <span user>John Doe</span>
      <span date>2024-10-31</span>
    </app-moj-timeline-item>
  `,
})
class TestHostComponentWithoutDescriptionComponent {}

describe('MojTimelineItemComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: MojTimelineItemComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojTimelineItemComponent],
      declarations: [TestHostComponent, TestHostComponentWithoutDescriptionComponent],
    }).compileComponents();
  });

  describe('with description', () => {
    beforeEach(async () => {
      fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();
      fixture.detectChanges();

      component = fixture.debugElement.query(By.directive(MojTimelineItemComponent)).componentInstance;
    });

    it('should detect the description element', () => {
      expect(component.hasDescriptionElement).toBeTrue();
    });

    it('should render the description content', async () => {
      const descriptionElement = fixture.debugElement.query(By.css('.moj-timeline__description'));
      expect(descriptionElement).toBeTruthy();
    });
  });

  describe('without description', () => {
    let fixtureWithoutDescription: ComponentFixture<TestHostComponentWithoutDescriptionComponent>;

    beforeEach(async () => {
      fixtureWithoutDescription = TestBed.createComponent(TestHostComponentWithoutDescriptionComponent);
      fixtureWithoutDescription.detectChanges();

      component = fixtureWithoutDescription.debugElement.query(
        By.directive(MojTimelineItemComponent),
      ).componentInstance;
    });

    it('should not detect a description element', () => {
      expect(component.hasDescriptionElement).toBeFalse();
    });

    it('should not render the description content', () => {
      const descriptionElement = fixtureWithoutDescription.debugElement.query(By.css('.moj-timeline__description'));
      expect(descriptionElement).toBeNull();
    });
  });
});
