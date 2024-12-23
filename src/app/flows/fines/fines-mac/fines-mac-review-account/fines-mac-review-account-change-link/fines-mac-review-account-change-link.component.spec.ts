import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacReviewAccountChangeLinkComponent } from './fines-mac-review-account-change-link.component';

describe('FinesMacReviewAccountChangeLinkComponent', () => {
  let component: FinesMacReviewAccountChangeLinkComponent | null;
  let fixture: ComponentFixture<FinesMacReviewAccountChangeLinkComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountChangeLinkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountChangeLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterAll(() => {
    component = null;
    fixture = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit change link event', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    spyOn(component.emitChange, 'emit');

    component.changeData();

    expect(component.emitChange.emit).toHaveBeenCalled();
  });
});
