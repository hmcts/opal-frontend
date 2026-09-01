import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesApiSelectBusComponent } from './fines-api-select-bus.component';

describe('FinesApiSelectBusComponent', () => {
  let component: FinesApiSelectBusComponent;
  let fixture: ComponentFixture<FinesApiSelectBusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesApiSelectBusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesApiSelectBusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a placeholder select business units page', () => {
    expect(fixture.nativeElement.textContent).toContain('Placeholder for Automatic Cash Input - Select Business Units');
  });
});
