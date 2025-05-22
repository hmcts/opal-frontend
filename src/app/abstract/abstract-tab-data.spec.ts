import { TestBed } from '@angular/core/testing';
import { AbstractTabData } from './abstract-tab-data';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

class TestTabData extends AbstractTabData {}

describe('AbstractTabData', () => {
  let service: TestTabData;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    activatedRoute = jasmine.createSpyObj('ActivatedRoute', [], {
      parent: {},
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRoute },
        TestTabData,
      ],
    });

    service = TestBed.inject(TestTabData);
  });

  it('should format count with cap correctly', () => {
    expect(service.formatCountWithCap(10, 99)).toBe('10');
    expect(service.formatCountWithCap(100, 99)).toBe('99+');
  });

  it('should navigate and set activeTab on handleTabSwitch', () => {
    service.handleTabSwitch('example-tab');
    expect(service.activeTab).toBe('example-tab');
    expect(router.navigate).toHaveBeenCalledWith([], {
      relativeTo: activatedRoute.parent,
      fragment: 'example-tab',
    });
  });

  it('should return transformed data from createTabDataStream when tab === initialTab', (done) => {
    const initialData = { value: 1 };
    const initialTab = 'tab1';
    const fragment$ = of(initialTab);
    const result = service.createTabDataStream(
      initialData,
      initialTab,
      fragment$,
      () => ({}),
      () => of({ value: 2 }),
      (data) => data.value.toString(),
    );
    result.subscribe((res) => {
      expect(res).toBe('1');
      done();
    });
  });

  it('should fetch and transform data from createTabDataStream when tab !== initialTab', (done) => {
    const initialData = { value: 1 };
    const initialTab = 'tab1';
    const fragment$ = of('tab2');
    const result = service.createTabDataStream(
      initialData,
      initialTab,
      fragment$,
      () => ({}),
      () => of({ value: 2 }),
      (data) => data.value.toString(),
    );
    result.subscribe((res) => {
      expect(res).toBe('2');
      done();
    });
  });

  it('should return formatted count from createCountStream when tab === initialTab', (done) => {
    const result = service.createCountStream(
      'tab1',
      5,
      of('tab1'),
      () => ({}),
      () => of({ count: 99 }),
      (data) => data.count,
      (count) => `${count}+`,
    );
    result.subscribe((res) => {
      expect(res).toBe('5+');
      done();
    });
  });

  it('should fetch and format count from createCountStream when tab !== initialTab', (done) => {
    const result = service.createCountStream(
      'tab1',
      5,
      of('tab2'),
      () => ({}),
      () => of({ count: 150 }),
      (data) => data.count,
      (count) => (count > 99 ? '99+' : `${count}`),
    );
    result.subscribe((res) => {
      expect(res).toBe('99+');
      done();
    });
  });

  it('should use the default formatFn when none is provided', (done) => {
    const fragment$ = of('tab1');
    const initialTab = 'tab1';
    const initialCount = 7;

    const result = service.createCountStream(
      initialTab,
      initialCount,
      fragment$,
      () => ({}),
      () => of({ count: 123 }),
      (data) => data.count,
    );

    result.subscribe((res) => {
      expect(res).toBe('7');
      done();
    });
  });
});
