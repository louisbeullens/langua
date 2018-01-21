import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router'; //TODO Nog in gebruik?
import {ApiService} from "../../api.service";   //TODO Nog in gebruik?
import { Input } from '@angular/core';

@Component({
    selector: 'app-verb-detail-english',
    templateUrl: './verb-detail-english.component.html',
    styleUrls: ['./verb-detail-english.component.css']
})
export class VerbDetailEnglishComponent implements OnInit {

    @Input() public verb;
    @Input() public tenses;
    @Input() public conjugations;

    constructor() {
    }

    ngOnInit() {
    }

}
