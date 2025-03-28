import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesDraftCheckAndManageComponent } from './fines-draft-check-and-manage.component';

describe('FinesDraftCheckAndManageComponent', () => {
  let component: FinesDraftCheckAndManageComponent;
  let fixture: ComponentFixture<FinesDraftCheckAndManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesDraftCheckAndManageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesDraftCheckAndManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
