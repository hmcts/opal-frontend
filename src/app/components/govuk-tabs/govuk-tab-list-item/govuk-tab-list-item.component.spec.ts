import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukTabListItemComponent } from './govuk-tab-list-item.component';

describe('GovukTabListItemComponent', () => {
  let component: GovukTabListItemComponent;
  let fixture: ComponentFixture<GovukTabListItemComponent>;

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate the tab href', () => {
    const element = fixture.nativeElement.querySelector('.govuk-tabs__tab');
    expect(element.getAttribute('href')).toBe('#test');
  });

  it('should populate the tab name', () => {
    const element = fixture.nativeElement.querySelector('.govuk-tabs__tab');
    expect(element.innerText).toBe('Test Content');
  });
});
