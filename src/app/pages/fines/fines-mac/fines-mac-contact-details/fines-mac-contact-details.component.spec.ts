import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacContactDetailsComponent } from './fines-mac-contact-details.component';

describe('FinesMacContactDetailsComponent', () => {
  let component: FinesMacContactDetailsComponent;
  let fixture: ComponentFixture<FinesMacContactDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacContactDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinesMacContactDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
