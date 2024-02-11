import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertSecotdsToHoursAndMinutes',
})
export class ConvertSecondsToHoursAndMinutesPipe implements PipeTransform {
  transform(value: number): string {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0'
    )}`;
  }
}
