import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfiscationPersonalDetailsComponent } from './confiscation-personal-details.component';
import { IConfiscationPersonalDetailsForm } from './interfaces/confiscation-personal-details-form.interface';
import { CONFISCATION_PERSONAL_DETAILS_FORM_MOCK } from './mocks/confiscation-personal-details-form.mock';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ConfiscationStoreType } from '../stores/types/confiscation-store.type';
import { ConfiscationStore } from '../stores/confiscation.store';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';

describe('ConfiscationPersonalDetailsComponent', () => {
  let component: ConfiscationPersonalDetailsComponent;
  let fixture: ComponentFixture<ConfiscationPersonalDetailsComponent>;
  let formSubmit: IConfiscationPersonalDetailsForm;
  let confiscationStore: ConfiscationStoreType;

  beforeEach(async () => {
    formSubmit = structuredClone(CONFISCATION_PERSONAL_DETAILS_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [ConfiscationPersonalDetailsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfiscationPersonalDetailsComponent);
    component = fixture.componentInstance;

    confiscationStore = TestBed.inject(ConfiscationStore);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission and navigate to account details', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.nestedFlow = false;

    component.handlePersonalDetailsSubmit(formSubmit);

    expect(confiscationStore.personalDetails()).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([PAGES_ROUTING_PATHS.children.dashboard], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate next route', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.nestedFlow = true;

    component.handlePersonalDetailsSubmit(formSubmit);

    expect(confiscationStore.personalDetails()).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([PAGES_ROUTING_PATHS.children.dashboard], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should test handleUnsavedChanges', () => {
    component.handleUnsavedChanges(true);
    expect(confiscationStore.unsavedChanges()).toBeTruthy();
    expect(component.stateUnsavedChanges).toBeTruthy();

    component.handleUnsavedChanges(false);
    expect(confiscationStore.unsavedChanges()).toBeFalsy();
    expect(component.stateUnsavedChanges).toBeFalsy();
  });
});
