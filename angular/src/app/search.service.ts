import {EventEmitter, Injectable, Output} from '@angular/core';

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
    private words = [];
    private searchValue = '';
    public resultsChanged: Subject<any>;

    constructor(private api: ApiService, private router: Router, private memberService: MemberService) {
        this.resultsChanged = new Subject<any>();
        this.memberService.currentLanguageIdChanged.subscribe( () => this.requestResults(this.searchValue) );
    }

    changeSearchValue(searchValue: string): void {
        this.searchValue = searchValue;
        this.requestResults(searchValue);
    }

    requestResults(searchValue: string): void {
        const filter = {
            include: 'wordType',
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
        console.log(filter);
        this.api.get<Object[]>('/Words', {filter: filter}).subscribe(words => {
            words.sort(function(a: Word, b: Word) {
                const c = (a.singular !== '') ? a.singular : a.plural;
                const d = (b.singular !== '') ? b.singular : b.plural;
                return (c > d) ? 1 : 0;
            });
            console.log('words', words);
            this.words = words;
            this.resultsChanged.next();
        }, err => console.log(err));
    }

    getResults() {
        return this.words;
    }
}
