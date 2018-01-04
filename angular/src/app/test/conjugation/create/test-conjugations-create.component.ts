import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {ApiService} from "../../../api.service";
import {MemberService} from "../../../member.service";
import {TestService} from "../../../test.service";

@Component({
    selector: 'app-test-conjugations-create',
    templateUrl: './test-conjugations-create.component.html',
    styleUrls: ['./test-conjugations-create.component.css']
})
export class TestConjugationsCreateComponent implements OnInit {
    public languages: Observable<any>;
    public languageId: number;
    public tenses: Observable<any>;
    public regularity = 0;
    public selection = 0;

    public tenseIds = [];

    public tests: Observable<any>;

    constructor(private api: ApiService, private memberService: MemberService, private testService: TestService) {
    }

    async ngOnInit() {
        this.languageId = this.memberService.getTrainingLanguageId();
        this.languages = this.memberService.getTrainingLanguages();
        this.tenses = this.getTenses();

        if (await this.memberService.getMemberId(false)) {
            this.tests = await this.testService.getUnfinishedConjugationTests();
        }
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
