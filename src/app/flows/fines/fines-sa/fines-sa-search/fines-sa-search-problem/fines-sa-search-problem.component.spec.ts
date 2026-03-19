import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { FinesSaSearchProblemComponent } from './fines-sa-search-problem.component';
import { FinesSaStore } from '../../stores/fines-sa.store';
import { FINES_SA_SEARCH_ROUTING_PATHS } from '../routing/constants/fines-sa-search-routing-paths.constant';
import { FinesSaStoreType } from '../../stores/types/fines-sa.type';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesSaSearchProblemComponent', () => {
  let component: FinesSaSearchProblemComponent;
  let fixture: ComponentFixture<FinesSaSearchProblemComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let routerSpy: any;
  let mockFinesSaStore: FinesSaStoreType;

  beforeEach(async () => {
    routerSpy = {
      navigate: vi.fn().mockName('Router.navigate'),
    };

    await TestBed.configureTestingModule({
      imports: [FinesSaSearchProblemComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { parent: 'search-account' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSaSearchProblemComponent);
    component = fixture.componentInstance;

    mockFinesSaStore = TestBed.inject(FinesSaStore);
    mockFinesSaStore.setActiveTab('individuals');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enforce current template link semantics', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const templateConsts = ((FinesSaSearchProblemComponent as any).ɵcmp?.consts ?? []).filter((entry: unknown) =>
      Array.isArray(entry),
    ) as unknown[][];
    const templateFunction =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((FinesSaSearchProblemComponent as any).ɵcmp?.template?.toString() as string | undefined) ?? '';
    const actionLinkConsts = templateConsts.filter(
      (entry) => entry.includes('govuk-link') && entry.includes('href') && entry.includes('click'),
    );

    expect(actionLinkConsts.length).toBeGreaterThanOrEqual(1);
    actionLinkConsts.forEach((entry) => {
      expect(entry).toContain('govuk-link--no-visited-state');
      expect(entry).toContain('href');
      expect(entry).toContain('');
      expect(entry).not.toContain('tabindex');
    });
    expect(templateFunction).not.toContain('keydown.enter');
    expect(templateFunction).not.toContain('keyup.enter');
  });

  it('should navigate back with fragment when goBack is called', () => {
    component.goBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith([FINES_SA_SEARCH_ROUTING_PATHS.root], {
      relativeTo: component['activatedRoute'].parent,
      fragment: 'individuals',
    });
  });

  it('should prevent default and navigate when goBack is called with an event', () => {
    const event = new Event('click');
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    component.goBack(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith([FINES_SA_SEARCH_ROUTING_PATHS.root], {
      relativeTo: component['activatedRoute'].parent,
      fragment: 'individuals',
    });
  });

  it('should click go back link and prevent default via the passed template event', () => {
    const link = fixture.nativeElement.querySelector('a.govuk-link') as HTMLAnchorElement | null;
    expect(link).toBeTruthy();
    if (!link) throw new Error('Go back link not found');

    expect(link.classList.contains('govuk-link--no-visited-state')).toBe(true);
    expect(link.getAttribute('href')).toBe('');
    expect(link.getAttribute('tabindex')).toBeNull();

    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handlerSpy = vi.spyOn<any, any>(component, 'goBack');

    link.dispatchEvent(event);

    expect(handlerSpy).toHaveBeenCalledWith(event);
    expect(event.defaultPrevented).toBe(true);
  });
});
