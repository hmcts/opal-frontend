import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesDraftCheckAndValidateTabsComponent } from './fines-draft-check-and-validate-tabs.component';

describe('FinesDraftCheckAndValidateTabsComponent', () => {
  let component: FinesDraftCheckAndValidateTabsComponent;
  let fixture: ComponentFixture<FinesDraftCheckAndValidateTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesDraftCheckAndValidateTabsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesDraftCheckAndValidateTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
