import {EventEmitter, Injectable, Output} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {HttpClient} from "@angular/common/http";
import {Settings} from "./settings";

import {Router} from "@angular/router";
import {MemberService} from "./member.service";

interface Word {
  singular: string;
  plural: string;
}

@Injectable()
export class SearchService {
    @Output() resultsChanged = new EventEmitter<string>();
    private settings = Settings;
    private words = [];
    private searchValue = '';

    constructor(private http: HttpClient, private router: Router, private memberService: MemberService) {
        this.memberService.currentLanguageIdChanged.subscribe( () => this.requestResults(this.searchValue) );
    }

    changeSearchValue(searchValue: string): void {
        this.searchValue = searchValue;
        this.requestResults(searchValue);
    }

    requestResults(searchValue: string): void {
        const filter = encodeURI(JSON.stringify({
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
        }));
        console.log(filter);
        this.http.get<Object[]>(this.settings.host + '/api/Words?filter=' + filter).subscribe(words => {
            console.log('http response');
            words.sort(function(a: Word, b: Word) {
                const c = (a.singular !== '') ? a.singular : a.plural;
                const d = (b.singular !== '') ? b.singular : b.plural;
                return (c > d) ? 1 : 0;
            });
            this.words = words;
            this.router.navigateByUrl('/dictionary');
            this.resultsChanged.emit(searchValue);
        }, err => console.log(err));
    }

    getResults() {
        console.log('getResults', this.words.length);
        console.log(this.words);
        return this.words;
    }

}
