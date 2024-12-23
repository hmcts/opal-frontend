import { TestBed } from '@angular/core/testing';

import { TransformationService } from './transformation.service';
import { ITransformItem } from './interfaces/transform-item.interface';

describe('TransformationService', () => {
  let service: TransformationService | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransformationService],
    });

    service = TestBed.inject(TransformationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterAll(() => {
    service = null;
    TestBed.resetTestingModule();
  });

  describe('applyTransformation', () => {
    it('should return the original value if no transformation is applied', () => {
      if (!service) {
        fail('Required properties not properly initialised');
        return;
      }

      const value = 'test';
      const transformItem: ITransformItem = {
        key: 'testKey',
        transformType: 'none',
        dateInputFormat: null,
        dateOutputFormat: null,
      };
      const result = service['applyTransformation'](value, transformItem);
      expect(result).toBe(value);
    });

    it('should transform date values correctly', () => {
      if (!service) {
        fail('Required properties not properly initialised');
        return;
      }

      const value = '04/06/1991';
      const transformItem: ITransformItem = {
        key: 'dateKey',
        transformType: 'date',
        dateInputFormat: 'dd/MM/yyyy',
        dateOutputFormat: 'yyyy-MM-dd',
      };

      const result = service['applyTransformation'](value, transformItem);
      expect(result).toBe('1991-06-04');
    });
  });

  describe('transformObjectValues', () => {
    it('should return the input if it is not an object', () => {
      if (!service) {
        fail('Required properties not properly initialised');
        return;
      }

      const input = 'not an object';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = service.transformObjectValues(input as any, []);
      expect(result).toBe(input);
    });

    it('should transform object values based on the given configuration', () => {
      if (!service) {
        fail('Required properties not properly initialised');
        return;
      }

      const input = { dateKey: '01/01/1991', otherKey: 'value' };
      const transformItems: ITransformItem[] = [
        {
          key: 'dateKey',
          transformType: 'date',
          dateInputFormat: 'dd/MM/yyyy',
          dateOutputFormat: 'yyyy-MM-dd',
        },
      ];

      const result = service.transformObjectValues(input, transformItems);
      expect(result.dateKey).toBe('1991-01-01');
    });

    it('should recursively transform nested objects', () => {
      if (!service) {
        fail('Required properties not properly initialised');
        return;
      }

      const input = { nested: { dateKey: '01/01/1991' } };
      const transformItems: ITransformItem[] = [
        {
          key: 'dateKey',
          transformType: 'date',
          dateInputFormat: 'dd/MM/yyyy',
          dateOutputFormat: 'yyyy-MM-dd',
        },
      ];
      expect(service.transformObjectValues(input, transformItems)).toEqual({ nested: { dateKey: '1991-01-01' } });
    });
  });
});
