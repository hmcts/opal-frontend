import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukTableComponent } from './govuk-table.component';

describe('GovukTableComponent', () => {
  let component: GovukTableComponent;
  let fixture: ComponentFixture<GovukTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
