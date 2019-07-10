import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(value: any, options?: any): any {
    const array = Object.values(value);
    if (typeof options === "string") {
      options = { column: options };
    }
    options = {
      column: 'id',
      desc: false,
      ...options
    };
    const column = options.column;
    array.sort((one, other) => {
      let ret;
      if (one[column] > other[column]) {
        ret = 1;
      } else if (one[column] === other[column]) {
        ret = 0;
      } else {
        ret = -1;
      }
      if (options.desc) {
        ret = ret * -1;
      }
      return ret;
    });
    return array;
  }

}
