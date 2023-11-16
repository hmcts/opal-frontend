import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukHeaderComponent } from './govuk-header.component';

describe('GovukHeaderComponent', () => {
  let component: GovukHeaderComponent;
  let fixture: ComponentFixture<GovukHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
