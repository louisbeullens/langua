import { EventEmitter, Injectable, Output, transition } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient } from "@angular/common/http";

import { Router } from "@angular/router";
import { MemberService } from "./member.service";
import { ApiService } from './api.service';
import { Subject } from 'rxjs/Subject';

import { map } from 'rxjs/operators';

interface Word {
    singular: string;
    plural: string;
}

@Injectable()
export class SearchService {
    private results = {
        native: [],
        current: []
    };
    private searchValue = '';
    public searchValueChanged: Subject<any>;

    constructor(private api: ApiService, private router: Router, private memberService: MemberService) {
        this.searchValueChanged = new Subject<any>();
    }

    setSearchValue(searchValue: string, id: number): void {
        this.searchValue = searchValue;
        this.searchValueChanged.next({value: searchValue, id: id });
    }

    getSearchValue() {
        return this.searchValue;
    }

    async getResults(searchValue: string): Promise<any> {
        const nativeScope = {
            include: 'wordType',
            where: { languageId: this.memberService.getCurrentLanguageId() }
        };
        const nativeFilter = {
            include: [
                'wordType',
                { relation: 'translations1', scope: nativeScope },
                { relation: 'translations2', scope: nativeScope }
            ],
            where: {
                and: [
                    {
                        or: [
                            { singular: { like: '%' + searchValue + '%' } },
                            { plural: { like: '%' + searchValue + '%' } }
                        ]
                    },
                    { languageId: this.memberService.getNativeLanguageId() }
                ]
            }
        };
        let words = await this.api.get<any>('/Words', { filter: nativeFilter }).toPromise();
        this.results.native = this.parseWords(words);

        const currentScope = {
            include: 'wordType',
            where: { languageId: this.memberService.getNativeLanguageId() }
        };
        const currentFilter = {
            include: [
                'wordType',
                { relation: 'translations1', scope: currentScope },
                { relation: 'translations2', scope: currentScope }
            ],
            where: {
                and: [
                    {
                        or: [
                            { singular: { like: '%' + searchValue + '%' } },
                            { plural: { like: '%' + searchValue + '%' } }
                        ]
                    },
                    { languageId: this.memberService.getCurrentLanguageId() }
                ]
            }
        };
        return this.api.get<any>('/Words', { filter: currentFilter }).pipe(map(words => {
            this.results.current = this.parseWords(words);
            return this.results;
        })).toPromise();
    }

    parseWords(words) {
        words = words.filter(element => {
            return element.translations1.length > 0 || element.translations2.length > 0;
        });

        words.sort((a: Word, b: Word) => {
            const c = (a.singular !== '') ? a.singular.toLowerCase() : a.plural.toLowerCase();
            const d = (b.singular !== '') ? b.singular.toLowerCase() : b.plural.toLowerCase();
            return (c > d) ? 1 : (c === d) ? 0 : -1;
        });

        for (let i = 0; i < words.length; i++) {
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
}
