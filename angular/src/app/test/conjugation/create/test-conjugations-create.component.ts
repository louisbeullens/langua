import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {ApiService} from "../../../api.service";
import {MemberService} from "../../../member.service";
import {TestService} from "../../../test.service";
import {ActivatedRoute} from '@angular/router';
import {map} from "rxjs/operators";

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

    public tests = [];

    constructor(private api: ApiService, private memberService: MemberService, public testService: TestService, private route: ActivatedRoute) {
    }

    async ngOnInit() {
        this.languageId = this.memberService.getTrainingLanguageId();
        this.languages = this.memberService.getTrainingLanguages().pipe(map(languages => {
            return languages.filter(value => {
                return (value.id !== 4);
            });
        }));

        if (await this.memberService.getMemberId(false)) {
            this.testService.getUnfinishedConjugationTests().subscribe(tests => {
                this.tests = tests;
            });
        }

        this.languageId = this.route.snapshot.data.languageId || this.languageId;
        this.tenses = this.getTenses();
    }

    onSubmit(form) {
        this.testService.createTestConjugations(this.languageId, this.tenseIds, this.regularity, this.selection).then(
            response => response.subscribe(
                test => {
                }));
    }

    onLanguageIdChanged() {
        this.tenseIds = [];
        this.tenses = this.getTenses();
    }

    onTenseChanged(id, checked) {

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
    }

    getTenses(): Observable<any> {
        return this.api.get<any>('/Languages/' + this.languageId.toString() + '/tenses');
    }
}
