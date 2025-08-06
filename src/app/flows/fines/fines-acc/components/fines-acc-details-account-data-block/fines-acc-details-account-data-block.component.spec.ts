import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccDetailsAccountDataBlockComponent } from './fines-acc-details-account-data-block.component';

describe('FinesAccDetailsAccountDataBlockComponent', () => {
  let component: FinesAccDetailsAccountDataBlockComponent;
  let fixture: ComponentFixture<FinesAccDetailsAccountDataBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccDetailsAccountDataBlockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDetailsAccountDataBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
