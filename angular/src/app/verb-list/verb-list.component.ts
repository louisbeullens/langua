import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ApiService} from "../api.service";
import {ActivatedRoute} from "@angular/router";

declare var document;

@Component({
    selector: 'app-verb-list',
    templateUrl: './verb-list.component.html',
    styleUrls: ['./verb-list.component.css']
})
export class VerbListComponent implements OnInit, AfterViewInit {

    public fragments: string[] = null;
    public indexedVerbs: any = null;

    constructor(private api: ApiService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.getVerbs();
    }

    ngAfterViewInit() {
        this.route.fragment.subscribe(fragment => {
            if (fragment && fragment.length === 1 && fragment >= 'A' && fragment <= 'Z') {
                const element = document.querySelector('#'+fragment);
                if (element) {
                    element.scrollIntoView({behavior: 'smooth'});
                }
            }
        });
    }

    getVerbs() {
        const filter = {
            where: {
                and: [
                    {languageId: 1},
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
