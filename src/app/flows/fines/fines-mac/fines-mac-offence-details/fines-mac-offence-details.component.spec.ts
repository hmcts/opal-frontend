import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsComponent } from './fines-mac-offence-details.component';

describe('FinesMacOffenceDetailsComponent', () => {
  let component: FinesMacOffenceDetailsComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsComponent);
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
