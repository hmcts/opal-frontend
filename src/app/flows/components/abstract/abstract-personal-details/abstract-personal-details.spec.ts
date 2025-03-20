import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AbstractPersonalDetailsComponent } from './abstract-personal-details';

class TestAbstractPersonalDetailsComponent extends AbstractPersonalDetailsComponent {
  constructor() {
    super();
  }
}

describe('AbstractAccountCommentsAndNotes', () => {
  let component: TestAbstractPersonalDetailsComponent | null;
  let fixture: ComponentFixture<TestAbstractPersonalDetailsComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestAbstractPersonalDetailsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAbstractPersonalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with the correct controls', () => {
    component!['setupPersonalDetailsForm']('test');
    expect(component?.form.contains('test_personal_details_title')).toBeTruthy();
    expect(component?.form.contains('test_personal_details_forenames')).toBeTruthy();
    expect(component?.form.contains('test_personal_details_surname')).toBeTruthy();
    expect(component?.form.contains('test_personal_details_aliases')).toBeTruthy();
    expect(component?.form.contains('test_personal_details_add_alias')).toBeTruthy();
    expect(component?.form.contains('test_personal_details_dob')).toBeTruthy();
    expect(component?.form.contains('test_personal_details_national_insurance_number')).toBeTruthy();
    expect(component?.form.contains('test_personal_details_address_line_1')).toBeTruthy();
    expect(component?.form.contains('test_personal_details_address_line_2')).toBeTruthy();
    expect(component?.form.contains('test_personal_details_address_line_3')).toBeTruthy();
    expect(component?.form.contains('test_personal_details_post_code')).toBeTruthy();
  });
});
