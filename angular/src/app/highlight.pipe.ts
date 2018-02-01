import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  accentsTidy(s) { 
    let r=s.toLowerCase(); 
    r = r.replace(new RegExp("[àáâãäå]", 'g'),"a"); 
    r = r.replace(new RegExp("ç", 'g'),"c"); 
    r = r.replace(new RegExp("[èéêë]", 'g'),"e"); 
    r = r.replace(new RegExp("[ìíîï]", 'g'),"i"); 
    r = r.replace(new RegExp("ñ", 'g'),"n");                             
    r = r.replace(new RegExp("[òóôõö]", 'g'),"o"); 
    r = r.replace(new RegExp("[ùúûü]", 'g'),"u"); 
    r = r.replace(new RegExp("[ýÿ]", 'g'),"y"); 
    return r; 
}; 

  transform(value: string, part: string, tag: string = 'b', cssClass: string = '', all: boolean = false): any {

    if (part === '') {
      return value;
    }
    
    const specialChars = {é:'e'};

    let tmpValue = this.accentsTidy(value);
    

    /*for (let i=0; i < value.length; i++) {
      tmpValue += specialChars[value.charAt(i)] || value.charAt(i);
    }*/
    
    let tmpPart = this.accentsTidy(part);

    /*for (let i=0; i < part.length; i++) {
      tmpPart += specialChars[part.charAt(i)] || part.charAt(i);
    }

    tmpPart = tmpPart.toLowerCase();*/
    let repPart = '.'.repeat(part.length);

    let startIndex;

    do {

      startIndex = tmpValue.lastIndexOf(tmpPart);
    
    if (startIndex !== -1) {
      tmpValue =  tmpValue.substring(0, startIndex) + repPart + tmpValue.substr(startIndex + part.length);
      value = value.substring(0, startIndex) + '<' + tag + ((cssClass !== '')? ' class="' + cssClass + '"': '') + '>' + value.substr(startIndex, part.length) + '</' + tag + '>' + value.substr(startIndex + part.length);
    }

  } while (all && startIndex !== -1);

    return value;

    /*const repl = '<' + tag + ((cssClass !== '')? ' class="' + cssClass + '"': '') + '>'+ part +'</' + tag + '>';
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
    }*/
  }

}
