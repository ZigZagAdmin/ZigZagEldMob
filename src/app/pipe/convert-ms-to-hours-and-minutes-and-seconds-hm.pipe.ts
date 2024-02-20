import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertMsToHoursAndMinutesAndSecondsHm',
})
export class ConvertMsToHoursAndMinutesAndSecondsHmPipe implements PipeTransform {
  transform(valueInMilliseconds: number): string {
    const valueInSeconds = Math.floor(valueInMilliseconds / 1000);

    const hours = Math.floor(valueInSeconds / 3600);
    const minutes = Math.floor((valueInSeconds % 3600) / 60);
    const seconds = valueInSeconds % 60;

    return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}min ${String(seconds).padStart(2, '0')}s`;
  }
}
