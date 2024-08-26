import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacDefaultDaysComponent } from './fines-mac-default-days.component';

describe('FinesMacDefaultDaysComponent', () => {
  let component: FinesMacDefaultDaysComponent;
  let fixture: ComponentFixture<FinesMacDefaultDaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacDefaultDaysComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinesMacDefaultDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
