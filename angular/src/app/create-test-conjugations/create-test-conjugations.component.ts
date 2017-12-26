import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {ApiService} from "../api.service";
import {MemberService} from "../member.service";
import {TestService} from "../test.service";

@Component({
    selector: 'app-create-test-conjugations',
    templateUrl: './create-test-conjugations.component.html',
    styleUrls: ['./create-test-conjugations.component.css']
})
export class CreateTestConjugationsComponent implements OnInit {
    public languages: Observable<any>;
    public languageId: number;
    public tenses: Observable<any>;
    public regularity = 0;
    public selection = 0;

    public tenseIds = [];

    constructor(private api: ApiService, private memberService: MemberService, private testService: TestService) {
    }

    ngOnInit() {
        this.languageId = this.memberService.getTrainingLanguageId();
        this.languages = this.memberService.getTrainingLanguages();
        this.tenses = this.getTenses();
    }

    onSubmit(form) {
        this.testService.createTestConjugations(this.languageId, this.tenseIds, this.regularity, this.selection).then(
            response => response.subscribe(
                test => console.log('success', test),
                err => console.log('error', err)));
    }

    onLanguageIdChanged() {
        console.log('change');
        this.tenses = this.getTenses();
    }

    onTenseChanged(id, checked) {
        console.log(id, checked);

        const index = this.tenseIds.indexOf(id);

        if (checked) {
            if (index === -1) {
                this.tenseIds.push(id);
            }
        } else {
            if (index !== -1) {
                this.tenseIds.splice(index, 1);
            }
        }

        console.log(this.tenseIds);
    }

    getTenses(): Observable<any> {
        return this.api.get<any>('/Languages/' + this.languageId.toString() + '/tenses');
    }
}
