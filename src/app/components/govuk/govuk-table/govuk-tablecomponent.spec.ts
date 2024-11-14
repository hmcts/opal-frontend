import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukTableComponent } from './govuk-table.component';

describe('GovukTable1Component', () => {
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

  it('should have default tableClasses as undefined', () => {
    expect(component.tableClasses).toBeUndefined();
  });

  it('should accept tableClasses as input', () => {
    component.tableClasses = 'test-class';
    fixture.detectChanges();
    expect(component.tableClasses).toBe('test-class');
  });
});
