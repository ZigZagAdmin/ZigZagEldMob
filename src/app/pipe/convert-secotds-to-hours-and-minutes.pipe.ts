import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertSecotdsToHoursAndMinutes'
})
export class ConvertSecotdsToHoursAndMinutesPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
