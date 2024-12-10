import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesCavComponent } from './fines-cav.component';

describe('FinesCavComponent', () => {
  let component: FinesCavComponent;
  let fixture: ComponentFixture<FinesCavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesCavComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesCavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
