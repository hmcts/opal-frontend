import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesCavAccountsComponent } from './fines-cav-accounts.component';

describe('FinesCavAccountsComponent', () => {
  let component: FinesCavAccountsComponent;
  let fixture: ComponentFixture<FinesCavAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesCavAccountsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesCavAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
