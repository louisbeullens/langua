import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from "../../api.service";
import {forEach} from '@angular/router/src/utils/collection'; //TODO Nog in gebruik?

@Component({
    selector: 'app-verb-detail-container',
    templateUrl: './verb-detail-container.component.html',
    styleUrls: ['./verb-detail-container.component.css']
})
export class VerbDetailContainerComponent implements OnInit {

    public verb = null;
    public tenses = null;
    public conjugations = null;

    constructor(private route: ActivatedRoute, private api: ApiService) {
    }

    ngOnInit() {
        const verbFilter = {
            where: {singular: this.route.snapshot.paramMap.get('name').split('_').join(' ')},
        };
        this.api.get<any>('/Words', {filter: verbFilter}).subscribe(async verbs => {
            const verb = verbs[0];
            this.verb = verbs[0];
            this.tenses = await this.api.get<any>('/Languages/' + verb.languageId + '/tenses', {filter: {order: 'order ASC'}}).toPromise();
            const tenseIds = this.tenses.map(tense => tense.id);
            const conjugationFilter = {
                include: 'tense',
                where: {
                    and: [
                        {verbId: verb.id},
                        {tenseId: {inq: tenseIds}}
                    ]
                },
                order: 'tenseId ASC'
            };
            const conjugationList = await this.api.get<any>('/Conjugations', {filter: conjugationFilter}).toPromise();
            console.log('conjugationList', conjugationList);
            const conjugations = {};

            for (let i = 0; i < conjugationList.length; i++) {
                conjugations[conjugationList[i].tense.id] = conjugationList[i];
            }

            this.conjugations = conjugations;
            console.log(this.conjugations);
        });
    }
}
