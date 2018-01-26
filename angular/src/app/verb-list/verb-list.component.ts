import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ApiService } from "../api.service";
import { ActivatedRoute } from "@angular/router";
import { MemberService } from '../member.service';
import { Location } from '@angular/common';

declare var window;
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
    public locale: string = '';
    public verbTypeOptionNames = ['Alle werkwoorden', 'Regelmatige werkwoorden', 'Uitzonderingen']
    public verbType = 0;

    constructor(private api: ApiService, public memberService: MemberService, private route: ActivatedRoute, private locationService: Location) {
    }

    ngOnInit() {
        this.route.fragment.subscribe(fragment => {
            if (fragment && fragment.length === 1 && fragment >= 'A' && fragment <= 'Z') {
                const element = document.querySelector('#' + fragment);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
        const languageIds = { es: 1, en: 2, nl: 4, fr: 5 };
        const locales = { 1: 'es', 2: 'en', 4: 'nl', 5: 'fr' };
        this.route.params.subscribe(params => {
            if (this.route.snapshot.paramMap.has('locale')) {
                this.languageId = languageIds[this.route.snapshot.params['locale']] || this.languageId;
                this.locale = this.route.snapshot.params['locale'];
                this.getVerbs();
            }
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
            this.locale = this.route.snapshot.params['locale'];
        }
        this.getVerbs();
    }

    onChange(type) {
        this.verbType = type;
        this.getVerbs();
    }

    getVerbs() {
        const filter: any = {
            where: {
                and: [
                    { languageId: this.languageId },
                    { wordTypeId: 19 }
                ]
            },
            order: 'index ASC'
        };
        if (this.verbType === 1) {
            filter.where.and.push({ isRegular: true });
        } else if (this.verbType === 2) {
            filter.where.and.push({ isRegular: false });
        }
        this.api.get<any>('/Words', { filter: filter }).subscribe(verbs => {
            this.indexedVerbs = [];
            this.fragments = [];
            verbs = verbs.map(entry => {
                return { singular: entry.singular, index: entry.index };
            });
            let index = '@'; //eerste ascii character voor 'A'
            const specialChars = { É: 'E' };
            for (let i = 0; i < verbs.length; i++) {
                let firstChar = verbs[i].index[0].toUpperCase();
                if (specialChars[firstChar]) {
                    firstChar = specialChars[firstChar];
                }
                if (firstChar > index) {
                    index = firstChar;
                    this.fragments.push(index);
                    this.indexedVerbs.push({ index: index, verbs: [] });
                }
                this.indexedVerbs[this.indexedVerbs.length - 1].verbs.push(verbs[i]);
            }
        });
    }
}
