import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesDraftCamComponent } from './fines-draft-cam.component';

describe('FinesDraftCamComponent', () => {
  let component: FinesDraftCamComponent;
  let fixture: ComponentFixture<FinesDraftCamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesDraftCamComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesDraftCamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
