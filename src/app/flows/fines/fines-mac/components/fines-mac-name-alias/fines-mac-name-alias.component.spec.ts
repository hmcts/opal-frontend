import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacNameAliasComponent } from './fines-mac-name-alias.component';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

describe('FinesMacNameAliasComponent', () => {
  let component: FinesMacNameAliasComponent;
  let fixture: ComponentFixture<FinesMacNameAliasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacNameAliasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacNameAliasComponent);
    component = fixture.componentInstance;

    component.form = new FormGroup({
      AddAlias: new FormControl(null),
      Aliases: new FormArray([]),
    });
    component.formControlErrorMessages = {};
    component.aliasControls = [];
    component.componentName = 'testComponent';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit addAlias event with correct aliasOutput when isRemoving is false', () => {
    const aliasControlLength = 5;
    const aliasFieldName = 'testFieldName';
    const expectedAliasOutput = { aliasControlLength, aliasFieldName };

    spyOn(component.addAlias, 'emit');

    component.emitAction(aliasControlLength, aliasFieldName);

    expect(component.addAlias.emit).toHaveBeenCalledWith(expectedAliasOutput);
  });

  it('should emit removeAlias event with correct aliasOutput when isRemoving is true', () => {
    const aliasControlLength = 5;
    const aliasFieldName = 'testFieldName';
    const expectedAliasOutput = { aliasControlLength, aliasFieldName };

    spyOn(component.removeAlias, 'emit');

    component.emitAction(aliasControlLength, aliasFieldName, true);

    expect(component.removeAlias.emit).toHaveBeenCalledWith(expectedAliasOutput);
  });
});
