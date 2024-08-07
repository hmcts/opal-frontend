import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacComponent } from './fines-mac.component';

describe('FinesMacComponent', () => {
  let component: FinesMacComponent;
  let fixture: ComponentFixture<FinesMacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
