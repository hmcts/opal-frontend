import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukTableComponent } from './govuk-table.component';

describe('GovukTable1Component', () => {
  let component: GovukTableComponent | null;
  let fixture: ComponentFixture<GovukTableComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukTableComponent);
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

  it('should have default tableClasses as undefined', () => {
    if (!component) {
      fail('component returned null');
      return;
    }
    expect(component.tableClasses).toBeUndefined();
  });

  it('should accept tableClasses as input', () => {
    if (!component || !fixture) {
      fail('component or fixture returned null');
      return;
    }
    component.tableClasses = 'test-class';
    fixture.detectChanges();
    expect(component.tableClasses).toBe('test-class');
  });
});
