import {Component, OnInit} from '@angular/core';
import {MemberService} from "../member.service";
import {Observable} from "rxjs/Observable";
import {ApiService} from "../api.service";
import {TestService} from "../test.service";

@Component({
    selector: 'app-create-test-translations',
    templateUrl: './create-test-translations.component.html',
    styleUrls: ['./create-test-translations.component.css']
})
export class CreateTestTranslationsComponent implements OnInit {
    // public languages: [any];
    public languages: Observable<any>; // TODO: language en wordType interface maken
    public wordTypes: Observable<any>;
    public toLanguageId: number;
    public fromLanguageId: number;
    public tests: Observable<any>;
    public selection = 0;
    private wordTypeIds = [];

    constructor(private api: ApiService, private memberService: MemberService, private testService: TestService) {
    }

    async ngOnInit() {
        this.fromLanguageId = this.memberService.getNativeLanguageId();
        this.toLanguageId = this.memberService.getTrainingLanguageId();

        this.languages = this.memberService.getTrainingLanguages();
        this.wordTypes = this.getWordTypes();

        if (await this.memberService.getMemberId(false)) {
            this.tests = await this.testService.getUnfinishedTranslationTests();
        }
    }

    getWordTypes(): Observable<any> {
        return this.api.get<any>('/Languages/' + this.toLanguageId.toString() + '/wordTypes');
    }

    onToLanguageChanged(): void {
        this.wordTypes = this.getWordTypes();
    }

    onWordTypeChanged(id, checked): void {
        console.log(id, checked);

        const index = this.wordTypeIds.indexOf(id);

        if (checked) {
            if (index === -1) {
                this.wordTypeIds.push(id);
            }
        } else {
            if (index !== -1) {
                this.wordTypeIds.splice(index, 1);
            }
        }

        console.log(this.wordTypeIds);
    }

    onResume(test) {
        this.testService.setCurrentTest(test);
    }

    onSubmit(form) {
        console.log(this.selection);
        console.log(form.value);
        this.testService.createTestTranslations(this.fromLanguageId, this.toLanguageId, this.wordTypeIds, this.selection).then(
            response => response.subscribe(
                test => console.log('success', test),
                err => console.log('error', err)));
    }

}
