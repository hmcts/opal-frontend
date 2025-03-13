import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesDraftCavCheckerComponent } from './fines-draft-cav-checker.component';

describe('FinesDraftCavCheckerComponent', () => {
  let component: FinesDraftCavCheckerComponent;
  let fixture: ComponentFixture<FinesDraftCavCheckerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesDraftCavCheckerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesDraftCavCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
