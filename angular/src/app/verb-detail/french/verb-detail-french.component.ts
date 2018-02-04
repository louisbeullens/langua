import {Component, OnInit} from '@angular/core';
import { Input } from '@angular/core';

@Component({
    selector: 'app-verb-detail-french',
    templateUrl: './verb-detail-french.component.html',
    styleUrls: ['./verb-detail-french.component.css']
})
export class VerbDetailFrenchComponent implements OnInit {

    @Input() public verb;
    @Input() public tenses;
    @Input() public conjugations;

    constructor() {
    }

    ngOnInit() {
        if (this.verb.singular.endsWith('evoir')) {
            this.verb.base = this.verb.singular.substr(0, (this.verb.singular.length - 4));
        } else {
            this.verb.base = this.verb.singular.substr(0, this.verb.singular.length - 2);
        }
    }

}
