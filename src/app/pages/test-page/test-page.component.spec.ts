import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPageComponent } from './test-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EMPTY } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('TestPageComponent', () => {
  let component: TestPageComponent;
  let fixture: ComponentFixture<TestPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestPageComponent, HttpClientTestingModule, RouterTestingModule],
    });
    fixture = TestBed.createComponent(TestPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate the observable', () => {
    expect(component.data$).toBe(EMPTY);

    component.handleFetchApiButtonClick();

    expect(component.data$).not.toBe(EMPTY);
  });
});
