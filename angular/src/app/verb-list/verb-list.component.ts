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

    public indexedVerbs = [];

    constructor(private api: ApiService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.getVerbs();
    }

    ngAfterViewInit() {
        this.route.fragment.subscribe(fragment => {
            if (fragment === 'D') {
                document.querySelector('#D').scrollIntoView({behavior: 'smooth'});
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
            verbs = verbs.map(entry => entry.index);
            let index = 'A';
            this.indexedVerbs.push({index: 'A', verbs: []})
            for (let i = 0; i < verbs.length; i++) {
                if (verbs[i][0].toUpperCase() > index) {
                    index = verbs[i][0].toUpperCase();
                    this.indexedVerbs.push({index: index, verbs: []});
                }
                this.indexedVerbs[this.indexedVerbs.length - 1].verbs.push(verbs[i]);
            }
        });
    }
}
