import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-conjugation-detail',
  templateUrl: './conjugation-detail.component.html',
  styleUrls: ['./conjugation-detail.component.css']
})

export class ConjugationDetailComponent implements OnInit {

  @Input() public languageId;
  @Input() public base;
  @Input() public conjugation;

  public forms = null;

  constructor() {
  }

  ngOnInit() {
    switch (this.languageId) {
        case 1:
          this.forms = ['', 'Yo', 'Tú', 'Él / Élla', 'Nosotros / Nosotras', 'Vosotros / Vosotras', 'Ellos / Ellas'];
          break;
        case 2:
          this.forms = ['', 'I', 'You', 'He / She / It', 'We', 'You', 'They'];
          break;
        case 2:
          this.forms = ['', 'Je', 'Tu', 'Il / Elle', 'Nous', 'Vous', 'Ils / Elles'];
          break;
        default:
          this.forms = ['','','','','','',''];
    }
  }

}
