import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  transform(value: string, bold: string): any {
    const parts = value.split(' ');
    parts[parts.length - 1] = parts[parts.length - 1].replace(bold,'<b>' + bold + '</b>');
    return parts.join(' ');
  }

}
