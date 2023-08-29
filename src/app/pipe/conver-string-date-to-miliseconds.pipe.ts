import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'converStringDateToMiliseconds',
})
export class ConverStringDateToMilisecondsPipe implements PipeTransform {
  transform(value: string): number {
    return new Date(value).getTime();
  }
}
