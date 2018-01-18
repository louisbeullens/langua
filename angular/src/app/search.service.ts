import {EventEmitter, Injectable, Output, transition} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {HttpClient} from "@angular/common/http";

import {Router} from "@angular/router";
import {MemberService} from "./member.service";
import { ApiService } from './api.service';
import { Subject } from 'rxjs/Subject';

interface Word {
  singular: string;
  plural: string;
}

@Injectable()
export class SearchService {
    private words = [[],[]];
    private searchValue = '';
    public resultsChanged: Subject<any>;

    constructor(private api: ApiService, private router: Router, private memberService: MemberService) {
        this.resultsChanged = new Subject<any>();
        this.memberService.currentLanguageIdChanged.subscribe(_ => {
            if (this.searchValue !== '') {
                this.requestResults(this.searchValue);
            }
        });
    }

    changeSearchValue(searchValue: string): void {
        this.searchValue = searchValue;
        this.requestResults(searchValue);
    }

    getSearchValue() {
        return this.searchValue;
    }

    requestResults(searchValue: string): void {
        const nativeScope = {
            include: 'wordType',
            where: {languageId: this.memberService.getCurrentLanguageId() }
        };
        const nativeFilter = {
            include: [
                'wordType',
                { relation: 'translations1', scope: nativeScope },
                { relation: 'translations2', scope: nativeScope }
            ],
            where: {
                and: [
                    {or: [
                        {singular: {like: '%' + searchValue + '%'}},
                        {plural: {like: '%' + searchValue + '%'}}
                    ]},
                    {languageId: this.memberService.getNativeLanguageId()}
                ]
            }
        };
        this.api.get<any>('/Words', {filter: nativeFilter}).subscribe(words => {
            this.words[0] = this.parseWords(words);
            
            const currentScope = {
                include: 'wordType',
                where: {languageId: this.memberService.getNativeLanguageId() }
            };
            const currentFilter = {
                include: [
                    'wordType',
                    { relation: 'translations1', scope: currentScope },
                    { relation: 'translations2', scope: currentScope }
                ],
                where: {
                    and: [
                        {or: [
                            {singular: {like: '%' + searchValue + '%'}},
                            {plural: {like: '%' + searchValue + '%'}}
                        ]},
                        {languageId: this.memberService.getCurrentLanguageId()}
                    ]
                }
            };
            this.api.get<any>('/Words', {filter: currentFilter}).subscribe(words => {
                this.words[1] = this.parseWords(words);
                this.resultsChanged.next();
            });
        }, err => console.log(err));
    }

    parseWords(words) {
        words = words.filter(element => {
            return element.translations1.length > 0 || element.translations2.length > 0;
        });
        words.sort((a: Word, b: Word) => {
            const c = (a.singular !== '') ? a.singular : a.plural;
            const d = (b.singular !== '') ? b.singular : b.plural;
            return (c > d) ? true : false;
        });
        for (let i=0; i< words.length; i++) {
            const word = words[i];
            let translations = [];
            if (word.translations1.length > 0) {
                translations = translations.concat(word.translations1);
            }
            if (word.translations2.length > 0) {
                translations = translations.concat(word.translations2);
            }
            word.translations = translations;
            word.translations1 = undefined;
            word.translations2 = undefined;
        }
        return words;
    }

    getResults() {
        return this.words;
    }
}
