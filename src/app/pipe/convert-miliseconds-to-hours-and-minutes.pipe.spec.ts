import { ConvertMilisecondsToHoursAndMinutesPipe } from './convert-miliseconds-to-hours-and-minutes.pipe';

describe('ConvertMilisecondsToHoursAndMinutesPipe', () => {
  it('create an instance', () => {
    const pipe = new ConvertMilisecondsToHoursAndMinutesPipe();
    expect(pipe).toBeTruthy();
  });
});
