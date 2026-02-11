import { describe, expect, it } from 'vitest';

import { createSpyObj } from './create-spy-obj.helper';

describe('createSpyObj', () => {
  it('creates named spies when a string name is provided', () => {
    const spyObj = createSpyObj('MyService', ['getValue', 'setValue']);

    spyObj['getValue'].mockReturnValue(123);

    expect(spyObj['getValue']()).toBe(123);
    expect(spyObj['getValue'].getMockName()).toBe('MyService.getValue');
    expect(spyObj['setValue'].getMockName()).toBe('MyService.setValue');
  });

  it('uses the name property when a non-string value has one', () => {
    const spyObj = createSpyObj({ name: 'NamedObject' }, ['run']);

    expect(spyObj['run'].getMockName()).toBe('NamedObject.run');
  });

  it('falls back to anonymous when no name can be resolved', () => {
    const spyObj = createSpyObj(undefined, ['execute']);

    expect(spyObj['execute'].getMockName()).toBe('anonymous.execute');
  });
});
