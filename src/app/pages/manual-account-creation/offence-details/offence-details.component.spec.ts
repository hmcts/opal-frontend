import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffenceDetailsComponent } from './offence-details.component';

describe('OffenceDetailsComponent', () => {
  let component: OffenceDetailsComponent;
  let fixture: ComponentFixture<OffenceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffenceDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OffenceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to account-details page on handleRoute', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.handleRoute('test');
    expect(routerSpy).toHaveBeenCalledWith(['test']);
  });
});
