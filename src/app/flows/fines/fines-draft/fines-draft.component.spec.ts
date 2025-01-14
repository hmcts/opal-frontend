import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesDraftComponent } from './fines-draft.component';

describe('FinesDraftComponent', () => {
  let component: FinesDraftComponent;
  let fixture: ComponentFixture<FinesDraftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesDraftComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
