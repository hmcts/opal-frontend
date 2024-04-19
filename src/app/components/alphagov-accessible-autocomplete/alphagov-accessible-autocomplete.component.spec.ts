import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphagovAccessibleAutocompleteComponent } from './alphagov-accessible-autocomplete.component';

describe('AlphagovAccessibleAutocompleteComponent', () => {
  let component: AlphagovAccessibleAutocompleteComponent;
  let fixture: ComponentFixture<AlphagovAccessibleAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphagovAccessibleAutocompleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlphagovAccessibleAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
