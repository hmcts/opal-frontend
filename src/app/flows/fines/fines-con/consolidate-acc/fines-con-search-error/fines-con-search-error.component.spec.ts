import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesConSearchErrorComponent } from './fines-con-search-error.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FinesConStore } from '../../stores/fines-con.store';
import { FINES_CON_ROUTING_PATHS } from '../../routing/constants/fines-con-routing-paths.constant';

describe('FinesConSearchErrorComponent', () => {
  let component: FinesConSearchErrorComponent;
  let fixture: ComponentFixture<FinesConSearchErrorComponent>;
  let routerSpy: { navigate: ReturnType<typeof vi.fn> };
  let finesConStore: InstanceType<typeof FinesConStore>;

  beforeEach(async () => {
    routerSpy = {
      navigate: vi.fn().mockName('Router.navigate'),
    };

    await TestBed.configureTestingModule({
      imports: [FinesConSearchErrorComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { parent: {} } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesConSearchErrorComponent);
    component = fixture.componentInstance;
    finesConStore = TestBed.inject(FinesConStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show National Insurance number guidance for individual defendant type', () => {
    vi.spyOn(finesConStore, 'getDefendantType').mockReturnValue('individual');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('National Insurance number, or');
  });

  it('should not show National Insurance number guidance for company defendant type', () => {
    vi.spyOn(finesConStore, 'getDefendantType').mockReturnValue('company');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('National Insurance number, or');
  });

  it('should navigate back to consolidate accounts search when goBack is called', () => {
    component.goBack();

    expect(routerSpy.navigate).toHaveBeenCalledWith([FINES_CON_ROUTING_PATHS.children.consolidateAcc], {
      relativeTo: component['activatedRoute'].parent,
      fragment: 'search',
    });
  });
});
