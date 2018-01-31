import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  transform(value: string, part: string, tag: string = 'b', cssClass: string = '', all: boolean = false): any {
    const repl = '<' + tag + ((cssClass !== '')? ' class="' + cssClass + '"': '') + '>'+ part +'</' + tag + '>';
    if (value.indexOf(part) !== -1) {
      if (all) {
        return value.split(part).join(repl);
      } else {
        const parts = value.split(' ');
        parts[parts.length - 1] = parts[parts.length - 1].replace(part, repl);
        return parts.join(' ');
      }
    } else {
      return value;
    }
  }

}
