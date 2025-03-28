import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesDraftCheckAndValidateComponent } from './fines-draft-check-and-validate.component';

describe('FinesDraftCheckAndValidateComponent', () => {
  let component: FinesDraftCheckAndValidateComponent;
  let fixture: ComponentFixture<FinesDraftCheckAndValidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesDraftCheckAndValidateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesDraftCheckAndValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
