import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesDraftCreateAndManageComponent } from './fines-draft-create-and-manage.component';

describe('FinesDraftCreateAndManageComponent', () => {
  let component: FinesDraftCreateAndManageComponent;
  let fixture: ComponentFixture<FinesDraftCreateAndManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesDraftCreateAndManageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesDraftCreateAndManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
