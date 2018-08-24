import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTitle'
})
export class FormatTitlePipe implements PipeTransform {

  transform(value: string): string {
    var res = "";
    var re = /[^a-zA-Z0-9א-ת ]/gi;
    value = value.replace(re, ""); 
    value.split(" ").forEach(function(el) {
      res += el.substring(0, 1).toUpperCase() + el.substring(1).toLowerCase() + " ";
    });
    res = res.trim();
    return res;
  }

}
