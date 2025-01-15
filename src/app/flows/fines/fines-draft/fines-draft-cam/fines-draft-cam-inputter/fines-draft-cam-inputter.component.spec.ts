import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesDraftCamInputterComponent } from './fines-draft-cam-inputter.component';

describe('FinesDraftCamInputterComponent', () => {
  let component: FinesDraftCamInputterComponent;
  let fixture: ComponentFixture<FinesDraftCamInputterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesDraftCamInputterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesDraftCamInputterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
