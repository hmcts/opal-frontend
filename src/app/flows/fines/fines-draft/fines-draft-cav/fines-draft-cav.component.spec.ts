import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesDraftCavComponent } from './fines-draft-cav.component';

describe('FinesDraftCavComponent', () => {
  let component: FinesDraftCavComponent;
  let fixture: ComponentFixture<FinesDraftCavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesDraftCavComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesDraftCavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
