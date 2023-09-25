import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordinal'
})
export class OrdinalPipe implements PipeTransform {

  transform(value: string | null): string {

    let s: string

    switch(Number(value) % 10) {
      case 1: {
        s = 'st'
        return value + s
      }
      case 2: {
        s = 'nd'
        return value + s
      }
      case 3: {
        s = 'rd'
        return value + s
      }
      default: {
        s ='th'
        return value + s
      }
    }
  }

}
