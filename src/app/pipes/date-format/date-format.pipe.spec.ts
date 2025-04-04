import { DateFormatPipe } from './date-format.pipe';
import { DateService } from '@services/date-service/date.service';

describe('DateFormatPipe', () => {
  let pipe: DateFormatPipe;
  let dateServiceSpy: jasmine.SpyObj<DateService>;

  beforeEach(() => {
    dateServiceSpy = jasmine.createSpyObj('DateService', ['getFromFormatToFormat']);
    pipe = new DateFormatPipe(dateServiceSpy);
  });

  it('should format a valid date using the given formats', () => {
    dateServiceSpy.getFromFormatToFormat.and.returnValue('1 Jan 2024');

    const result = pipe.transform('2024-01-01', 'yyyy-MM-dd', 'd MMM yyyy');

    expect(dateServiceSpy.getFromFormatToFormat).toHaveBeenCalledWith('2024-01-01', 'yyyy-MM-dd', 'd MMM yyyy');
    expect(result).toBe('1 Jan 2024');
  });

  it('should return "—" if the input value is null', () => {
    const result = pipe.transform(null, 'yyyy-MM-dd', 'd MMM yyyy');
    expect(result).toBe('—');
    expect(dateServiceSpy.getFromFormatToFormat).not.toHaveBeenCalled();
  });

  it('should return "—" if the input value is undefined', () => {
    const result = pipe.transform(undefined, 'yyyy-MM-dd', 'd MMM yyyy');
    expect(result).toBe('—');
    expect(dateServiceSpy.getFromFormatToFormat).not.toHaveBeenCalled();
  });

  it('should return empty string if formatting fails', () => {
    dateServiceSpy.getFromFormatToFormat.and.returnValue('');
    const result = pipe.transform('invalid-date', 'yyyy-MM-dd', 'd MMM yyyy');
    expect(result).toBe('');
  });
});
