import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukTableBodyRowDataComponent } from './govuk-table-body-row-data.component';

describe('GovukTableBodyRowDataComponent', () => {
  let component: GovukTableBodyRowDataComponent | null;
  let fixture: ComponentFixture<GovukTableBodyRowDataComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukTableBodyRowDataComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukTableBodyRowDataComponent);
    component = fixture.componentInstance;

    component.id = 'testColumn';

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
    expect(hostElement.classList.contains('govuk-table__cell')).toBe(true);
  });

  it('should set the host id to the key input', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }
    fixture.detectChanges();
    const hostElement: HTMLElement = fixture.nativeElement;
    expect(hostElement.id).toBe('testColumn');
  });
});
