import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { FinesSaSearchFilterBusinessUnitComponent } from './fines-sa-search-filter-business-unit.component';
import { FinesSaStore } from '../../stores/fines-sa.store';
import { FINES_SA_SEARCH_ROUTING_PATHS } from '../routing/constants/fines-sa-search-routing-paths.constant';
import { FinesSaStoreType } from '../../stores/types/fines-sa.type';

describe('FinesSaSearchFilterBusinessUnitComponent', () => {
  let component: FinesSaSearchFilterBusinessUnitComponent;
  let fixture: ComponentFixture<FinesSaSearchFilterBusinessUnitComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let mockFinesSaStore: FinesSaStoreType;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FinesSaSearchFilterBusinessUnitComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { parent: 'search-account' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSaSearchFilterBusinessUnitComponent);
    component = fixture.componentInstance;

    mockFinesSaStore = TestBed.inject(FinesSaStore);
    mockFinesSaStore.setActiveTab('individuals');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate back with fragment when onBackClick is called', () => {
    component.onBackClick();
    expect(routerSpy.navigate).toHaveBeenCalledWith([FINES_SA_SEARCH_ROUTING_PATHS.root], {
      relativeTo: component['activatedRoute'].parent,
      fragment: 'individuals',
    });
  });
});
