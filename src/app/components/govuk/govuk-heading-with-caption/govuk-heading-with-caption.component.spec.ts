import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukHeadingWithCaptionComponent } from './govuk-heading-with-caption.component';

describe('GovukHeadingWithCaptionComponent', () => {
  let component: GovukHeadingWithCaptionComponent | null;
  let fixture: ComponentFixture<GovukHeadingWithCaptionComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukHeadingWithCaptionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukHeadingWithCaptionComponent);
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
});
