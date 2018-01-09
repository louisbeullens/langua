import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-conjugation-detail',
  templateUrl: './conjugation-detail.component.html',
  styleUrls: ['./conjugation-detail.component.css']
})
export class ConjugationDetailComponent implements OnInit {

  @Input() public languageId;
  @Input() public baseLength;
  @Input() public conjugation;

  public forms = null;

  constructor() {
    console.log('langId', this.languageId);
  }

  ngOnInit() {
    switch (this.languageId) {
        case 1:
          this.forms = ['', 'Yo', 'Tú', 'Él', 'Nosotros', 'Vosotros', 'Ellos'];
          break;
        default:
          this.forms = ['','','','','','',''];
    }
  }

}
