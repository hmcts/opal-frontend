import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukTabListItemComponent } from './govuk-tab-list-item.component';

describe('GovukTabListItemComponent', () => {
  let component: GovukTabListItemComponent | null;
  let fixture: ComponentFixture<GovukTabListItemComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukTabListItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukTabListItemComponent);
    component = fixture.componentInstance;
    component.tabsId = 'test';
    component.tabsListItemId = 'testTwo';
    component.tabListItemHref = '#test';
    component.tabListItemName = 'Test Content';
    fixture.detectChanges();
  });

  afterAll(() => {
    fixture = null;
    component = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate the tab href', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const element = fixture.nativeElement.querySelector('.govuk-tabs__tab');
    expect(element.getAttribute('href')).toBe('#test');
  });

  it('should populate the tab name', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }
    const element = fixture.nativeElement.querySelector('.govuk-tabs__tab');
    expect(element.innerText).toBe('Test Content');
  });
});
