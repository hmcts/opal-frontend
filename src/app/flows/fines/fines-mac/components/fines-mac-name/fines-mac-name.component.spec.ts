import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacNameComponent } from './fines-mac-name.component';
import { FormControl, FormGroup } from '@angular/forms';

describe('FinesMacNameComponent', () => {
  let component: FinesMacNameComponent;
  let fixture: ComponentFixture<FinesMacNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacNameComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacNameComponent);
    component = fixture.componentInstance;

    component.form = new FormGroup({
      forenames: new FormControl(null),
      surname: new FormControl(null),
    });
    component.formControlErrorMessages = {};
    component.nameFieldIds = {
      forenames: 'forenames',
      surname: 'surname',
    };
    component.componentName = 'testComponent';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
