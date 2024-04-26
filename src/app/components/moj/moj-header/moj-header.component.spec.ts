import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojHeaderComponent } from './moj-header.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MojHeaderComponent', () => {
  let component: MojHeaderComponent;
  let fixture: ComponentFixture<MojHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojHeaderComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MojHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
