import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertSecondsToHoursAndMinutesHm',
})
export class ConvertSecondsToHoursAndMinutesHmPipe implements PipeTransform {
  transform(value: number): string {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);

    return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}min`;
  }
}
