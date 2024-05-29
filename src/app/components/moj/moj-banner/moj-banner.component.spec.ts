import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojBannerComponent } from './moj-banner.component';
import { By } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';

describe('MojBannerComponent', () => {
  let component: MojBannerComponent;
  let fixture: ComponentFixture<MojBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojBannerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojBannerComponent);
    component = fixture.componentInstance;

    component.text = 'This is a test banner message';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a success message', () => {
    component.type = 'success';
    fixture.detectChanges();

    // Query the element with the class 'moj-banner--success'
    const bannerElement = fixture.debugElement.query(By.css('.moj-banner--success'));
    expect(bannerElement).toBeTruthy(); // Check if the element exists

    // Query the element with the ID 'success-message'
    const messageElement = fixture.debugElement.query(By.css('#success-message'));
    expect(messageElement).toBeTruthy(); // Check if the element exists

    // Check if the messageElement contains the correct text
    expect(messageElement.nativeElement.textContent.trim()).toBe('This is a test banner message');
  });

  it('should create a warning message', () => {
    component.type = 'warning';
    fixture.detectChanges();
    const cdr = fixture.debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef);
    cdr.detectChanges();

    // Query the element with the class 'moj-banner--warning'
    const bannerElement = fixture.debugElement.query(By.css('.moj-banner--warning'));
    expect(bannerElement).toBeTruthy(); // Check if the element exists

    // Query the element with the ID 'warning-message'
    const messageElement = fixture.debugElement.query(By.css('#warning-message'));
    expect(messageElement).toBeTruthy(); // Check if the element exists

    // Check if the messageElement contains the correct text
    expect(messageElement.nativeElement.textContent.trim()).toBe('This is a test banner message');
  });

  it('should create a information message', () => {
    component.type = 'information';
    fixture.detectChanges();
    const cdr = fixture.debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef);
    cdr.detectChanges();

    // Query the element with the class 'moj-banner--information'
    const bannerElement = fixture.debugElement.query(By.css('.moj-banner--information'));
    expect(bannerElement).toBeTruthy(); // Check if the element exists

    // Query the element with the ID 'information-message'
    const messageElement = fixture.debugElement.query(By.css('#information-message'));
    expect(messageElement).toBeTruthy(); // Check if the element exists

    // Check if the messageElement contains the correct text
    expect(messageElement.nativeElement.textContent.trim()).toBe('This is a test banner message');
  });
});
