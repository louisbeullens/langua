import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from "../../api.service";
import {MemberService} from '../../member.service';

@Component({
    selector: 'app-verb-detail-container',
    templateUrl: './verb-detail-container.component.html',
    styleUrls: ['./verb-detail-container.component.css']
})
export class VerbDetailContainerComponent implements OnInit {

    public verb = null;
    public tenses = null;
    public conjugations = null;

    constructor(private route: ActivatedRoute, private api: ApiService, private memberService: MemberService) {
    }

    ngOnInit() {
        const scope = {
            where: {languageId: this.memberService.getNativeLanguageId()}
        }
        const verbFilter = {
            include: [
                {relation: 'translations1', scope: scope},
                {relation: 'translations2', scope: scope},
            ],
            where: {
                singular: this.route.snapshot.paramMap.get('name').split('_').join(' ')
            },
        };
        this.api.get<any>('/Words', {filter: verbFilter}).subscribe(async verbs => {
            const verb = verbs[0];

            verb.translations = [];
            if (verb.translations1.length > 0) {
                verb.translations = verb.translations.concat(verb.translations1);
            }
            if (verb.translations2.length > 0) {
                verb.translations = verb.translations.concat(verb.translations2);
            }
            verb.translations1 = undefined;
            verb.translations2 = undefined;

            this.verb = verb;

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
            const conjugations = {};

            for (let i = 0; i < conjugationList.length; i++) {
                conjugations[conjugationList[i].tense.id] = conjugationList[i];
            }

            this.conjugations = conjugations;
        });
    }
}
