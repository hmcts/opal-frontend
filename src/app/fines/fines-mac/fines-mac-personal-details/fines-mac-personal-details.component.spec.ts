import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacPersonalDetailsComponent } from './fines-mac-personal-details.component';

describe('FinesMacPersonalDetailsComponent', () => {
  let component: FinesMacPersonalDetailsComponent;
  let fixture: ComponentFixture<FinesMacPersonalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacPersonalDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinesMacPersonalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
