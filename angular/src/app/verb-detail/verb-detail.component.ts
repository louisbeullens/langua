import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from "../api.service";
import { forEach } from '@angular/router/src/utils/collection';

@Component({
    selector: 'app-verb-detail',
    templateUrl: './verb-detail.component.html',
    styleUrls: ['./verb-detail.component.css']
})
export class VerbDetailComponent implements OnInit {

    public verb = null;
    public translations = null;
    public tenses = null;
    public conjugations = null;

    constructor(private route: ActivatedRoute, private api: ApiService) {
    }

    ngOnInit() {
        const scope = {
            languageId: 4
        };
        const verbFilter = {
            include: [
                { relation: 'translations1', scope: scope},
                { relation: 'translations2', scope: scope}
            ],
            where: {index: this.route.snapshot.paramMap.get('name')},
        };
        this.api.get<any>('/Words', {filter: verbFilter}).subscribe(async verbs => {
            const verb = verbs[0];
            this.verb = verb;
            console.log(verb);
            let translations = [];
            if (verb.translations1) {
                translations = translations.concat(verb.translations1);
            }
            if (verb.translations2) {
                translations = translations.concat(verb.translations2);
            }
            translations = translations.map(translation => translation.singular);
            translations = translations.filter((value, index, array) => {
               return array.indexOf(value) === index;
            });
            this.translations = translations;
            console.log(translations);
            this.tenses = await this.api.get<any>('/Languages/' + verb.languageId + '/tenses', {filter: {order:'order ASC'}}).toPromise();
            const tenseIds = this.tenses.map(tense => tense.id);
            const conjugationFilter = {
                include: 'tense',
                where: {and: [
                    {verbId: verb.id},
                    {tenseId: {inq: tenseIds}}
                ]},
                order: 'tenseId ASC'
            };
            const conjugationList = await this.api.get<any>('/Conjugations', {filter: conjugationFilter}).toPromise();
            console.log('conjugationList',conjugationList);
            const conjugations = {};

            for (let i=0; i<conjugationList.length; i++) {
                conjugations[conjugationList[i].tense.id] = conjugationList[i];
            }

            this.conjugations = conjugations;
            console.log(this.conjugations);
        });
    }

}
