import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot } from '@angular/router';
import { TitleResolver } from './title.resolver';

describe('TitleResolver', () => {
  let resolver: TitleResolver;
  let titleService: Title;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TitleResolver,
        {
          provide: Title,
          useValue: {
            setTitle: jasmine.createSpy('setTitle'),
          },
        },
      ],
    });

    resolver = TestBed.inject(TitleResolver);
    titleService = TestBed.inject(Title);
  });

  it('should set the title to "OPAL - Frontend" if no title is provided in route data', () => {
    const route = new ActivatedRouteSnapshot();
    route.data = {};

    resolver.resolve(route);

    expect(titleService.setTitle).toHaveBeenCalledWith('OPAL - Frontend');
  });

  it('should set the title to "OPAL - Custom Title" if title is provided in route data', () => {
    const route = new ActivatedRouteSnapshot();
    route.data = { title: 'Custom Title' };

    resolver.resolve(route);

    expect(titleService.setTitle).toHaveBeenCalledWith('OPAL - Custom Title');
  });
});
