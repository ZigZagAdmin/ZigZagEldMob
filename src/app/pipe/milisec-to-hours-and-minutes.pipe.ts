import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'milisecToHoursAndMinutes',
})
export class MilisecToHoursAndMinutesPipe implements PipeTransform {
  transform(milliseconds: number): string {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0'
    )}`;
  }
}
