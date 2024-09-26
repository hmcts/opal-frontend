import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsSearchOffencesComponent } from './fines-mac-offence-details-search-offences.component';
import { ActivatedRoute } from '@angular/router';

describe('FinesMacOffenceDetailsSearchOffencesComponent', () => {
  let component: FinesMacOffenceDetailsSearchOffencesComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsSearchOffencesComponent>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsSearchOffencesComponent],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsSearchOffencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
