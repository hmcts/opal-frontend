import { FormControl } from '@angular/forms';
import { pastDateValidator } from './past-date.validator';

describe('pastDateValidator', () => {
  let control: FormControl;

  beforeEach(() => {
    control = new FormControl('');
  });

  it('should return null if the control value is null or empty', () => {
    control.setValue(null);
    expect(pastDateValidator()(control)).toBeNull();

    control.setValue('');
    expect(pastDateValidator()(control)).toBeNull();
  });

  it('should return null if the date is today or in the future', () => {
    const today = new Date();
    const formattedToday = formatDateForTest(today); // helper function below
    control.setValue(formattedToday);
    expect(pastDateValidator()(control)).toBeNull();

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    const formattedFutureDate = formatDateForTest(futureDate);
    control.setValue(formattedFutureDate);
    expect(pastDateValidator()(control)).toBeNull();
  });

  it('should return an error if the date is in the past', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 10); // 10 days in the past
    const formattedPastDate = formatDateForTest(pastDate);
    control.setValue(formattedPastDate);
    expect(pastDateValidator()(control)).toEqual({
      invalidPastDate: { value: formattedPastDate },
    });
  });
});

// Helper function to format the date as 'dd/MM/yyyy'
function formatDateForTest(date: Date): string {
  const day = ('0' + date.getDate()).slice(-2); // Ensure two digits
  const month = ('0' + (date.getMonth() + 1)).slice(-2); // Ensure two digits
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
