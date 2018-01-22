import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ApiService} from "../api.service";
import {ActivatedRoute} from "@angular/router";
import {MemberService} from '../member.service';
import {Location} from '@angular/common';

declare var document;

@Component({
    selector: 'app-verb-list',
    templateUrl: './verb-list.component.html',
    styleUrls: ['./verb-list.component.css']
})
export class VerbListComponent implements OnInit {

    public fragments: string[] = null;
    public indexedVerbs: any = null;
    public languageAdj = ['Spaanse', 'Engelse', 'Latijnse', 'Nederlandse', 'Franse'];

    public languageId: number;
    public verbType = 0;        //TODO Is deze nog in gebruik?

    constructor(private api: ApiService, public memberService: MemberService, private route: ActivatedRoute, private locationService: Location) {
    }

    ngOnInit() {
        this.route.fragment.subscribe(fragment => {
            if (fragment && fragment.length === 1 && fragment >= 'A' && fragment <= 'Z') {
                const element = document.querySelector('#' + fragment);
                if (element) {
                    element.scrollIntoView({behavior: 'smooth'});
                }
            }
        });
        const languageIds = {es: 1, en: 2, nl: 4, fr: 5};
        const locales = {1: 'es', 2: 'en', 4: 'nl', 5: 'fr'};
        this.route.params.subscribe(params => {
            this.languageId = languageIds[this.route.snapshot.params['locale']] || this.languageId;
            this.getVerbs();
        });
        this.memberService.currentLanguageIdChanged.subscribe(languageId => {
            this.languageId = languageId;
            if (this.route.snapshot.paramMap.has('locale')) {
                this.locationService.go('/verblist/' + locales[languageId]);
            }
            this.getVerbs();
        });
        this.languageId = this.memberService.getCurrentLanguageId();
        if (this.route.snapshot.paramMap.has('locale')) {
            this.languageId = languageIds[this.route.snapshot.params['locale']] || this.languageId;
        }
        this.getVerbs();
    }

    onChange() {    //TODO Is deze nog nodig voor iets?

    }

    getVerbs() {
        const filter = {
            where: {
                and: [
                    {languageId: this.languageId},
                    {wordTypeId: 19}
                ]
            },
            order: 'index ASC'
        };
        this.api.get<any>('/Words', {filter: filter}).subscribe(verbs => {
            this.indexedVerbs = [];
            this.fragments = [];
            verbs = verbs.map(entry => {
                return {singular: entry.singular, index: entry.index};
            });
            let index = '@';
            for (let i = 0; i < verbs.length; i++) {
                if (verbs[i].index[0].toUpperCase() > index) {
                    index = verbs[i].index[0].toUpperCase();
                    this.fragments.push(index);
                    this.indexedVerbs.push({index: index, verbs: []});
                }
                this.indexedVerbs[this.indexedVerbs.length - 1].verbs.push(verbs[i]);
            }
        });
    }
}
