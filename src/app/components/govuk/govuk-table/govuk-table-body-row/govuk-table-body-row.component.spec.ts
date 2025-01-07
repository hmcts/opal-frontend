import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukTableBodyRowComponent } from './govuk-table-body-row.component';

describe('GovukTableBodyRowComponent', () => {
  let component: GovukTableBodyRowComponent | null;
  let fixture: ComponentFixture<GovukTableBodyRowComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukTableBodyRowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukTableBodyRowComponent);
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

  it('should have the correct host class', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const hostElement: HTMLElement = fixture.nativeElement;
    expect(hostElement.classList.contains('govuk-table__row')).toBe(true);
  });
});
