import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukFooterComponent } from './govuk-footer.component';

describe('GovukFooterComponent', () => {
  let component: GovukFooterComponent;
  let fixture: ComponentFixture<GovukFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
