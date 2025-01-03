import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacDefaultDaysComponent } from './fines-mac-default-days.component';
import { SimpleChange } from '@angular/core';

describe('FinesMacDefaultDaysComponent', () => {
  let component: FinesMacDefaultDaysComponent | null;
  let fixture: ComponentFixture<FinesMacDefaultDaysComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacDefaultDaysComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacDefaultDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterAll(() => {
    component = null;
    fixture = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate days in default', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    component.date = '01/01/2022';
    component.daysInDefaultCalculatorForm.controls['years'].setValue(1);
    component.daysInDefaultCalculatorForm.setValue({
      years: 1,
      months: 2,
      weeks: 3,
      days: 4,
    });
    component.calculateDaysInDefault();
    expect(component.daysInDefaultCalculated).toBe(449);
  });

  it('should not calculate days in default if date is invalid', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    component.date = 'invalid-date';
    component.daysInDefaultCalculatorForm.setValue({
      years: 1,
      months: 2,
      weeks: 3,
      days: 4,
    });
    component.calculateDaysInDefault();
    expect(component.daysInDefaultCalculated).toBeUndefined();
  });

  it('should recalculate days in default when date changes and it is not the first change', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    component.date = '01/01/2023';
    component.daysInDefaultCalculatorForm.setValue({
      years: 1,
      months: 2,
      weeks: 3,
      days: 4,
    });
    component.calculateDaysInDefault();
    expect(component.daysInDefaultCalculated).toBe(450);

    component.date = '01/01/2024';
    component.ngOnChanges({ date: new SimpleChange('01/01/2023', '01/01/2024', false) });
    expect(component.daysInDefaultCalculated).toBe(450);
  });

  it('should unsubscribe from valueChanges on component destroy', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    spyOn(component['ngUnsubscribe'], 'next');
    spyOn(component['ngUnsubscribe'], 'complete');
    component.ngOnDestroy();
    expect(component['ngUnsubscribe'].next).toHaveBeenCalled();
    expect(component['ngUnsubscribe'].complete).toHaveBeenCalled();
  });
});
