import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukTableBodyRowDataComponent } from './govuk-table-body-row-data.component';

describe('GovukTableBodyRowDataComponent', () => {
  let component: GovukTableBodyRowDataComponent;
  let fixture: ComponentFixture<GovukTableBodyRowDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukTableBodyRowDataComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukTableBodyRowDataComponent);
    component = fixture.componentInstance;

    component.id = 'testColumn';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct host class', () => {
    const hostElement: HTMLElement = fixture.nativeElement;
    expect(hostElement.classList.contains('govuk-table__cell')).toBe(true);
  });

  it('should set the host id to the key input', () => {
    fixture.detectChanges();
    const hostElement: HTMLElement = fixture.nativeElement;
    expect(hostElement.id).toBe('testColumn');
  });
});
