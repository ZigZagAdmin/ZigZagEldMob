import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertMilisecondsToHoursAndMinutes',
})
export class ConvertMilisecondsToHoursAndMinutesPipe implements PipeTransform {
  transform(value: number): string {
    const hours = Math.floor(value / 3600000);
    const minutes = Math.floor((value % 3600000) / 60000);
    const hoursStr = hours < 10 ? `0${hours}` : `${hours}`;
    const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hoursStr}h:${minutesStr}m`;
  }
}
