import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router'; //TODO Nog in gebruik?
import {ApiService} from "../../api.service";   //TODO Nog in gebruik?
import { Input } from '@angular/core';

@Component({
    selector: 'app-verb-detail-spanish',
    templateUrl: './verb-detail-spanish.component.html',
    styleUrls: ['./verb-detail-spanish.component.css']
})
export class VerbDetailSpanishComponent implements OnInit {

    @Input() public verb;
    @Input() public tenses;
    @Input() public conjugations;

    constructor() {
    }

    ngOnInit() {
        this.verb.base = this.verb.singular.substr(0, this.verb.singular.length - 2);
    }

}
