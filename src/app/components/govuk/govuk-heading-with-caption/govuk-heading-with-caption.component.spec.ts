import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukHeadingWithCaptionComponent } from './govuk-heading-with-caption.component';

describe('GovukHeadingWithCaptionComponent', () => {
  let component: GovukHeadingWithCaptionComponent;
  let fixture: ComponentFixture<GovukHeadingWithCaptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukHeadingWithCaptionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukHeadingWithCaptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
