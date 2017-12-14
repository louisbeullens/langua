import {Component, OnInit} from '@angular/core';
import {TestService} from '../test.service';

@Component({
    selector: 'app-translation-question',
    templateUrl: './translation-question.component.html',
    styleUrls: ['./translation-question.component.css']
})
export class TranslationQuestionComponent implements OnInit {
    public question;
    public answer = '';
    public valid = '';
    correction = '';

    constructor(private testService: TestService) {
    }

    ngOnInit() {
        this.getQuestion();
    }

    getQuestion() {
        this.answer = '';
        this.valid = '';
        this.testService.getTranslationQuestion().subscribe(question => {
            if (question) {
                if (question.singular) {
                    this.correction = question.word.articleSingular + ' ' + question.word.singular;
                } else {
                    this.correction = question.word.articlePlural + ' ' + question.word.plural;
                }
                const translations = question.word.translations;
                for (let i = translations.length - 1; i >= 0; i--) {
                    if (translations[i].languageId !== this.testService.test.languageQuestionId) {
                        translations.splice(i, 1);
                    }
                }
                this.question = question;
            }
        });
    }

    onKeyDown(event) {
        console.log('onkeydown');
        if ((event.which === 13 || event.keyCode === 13) && this.answer !== '') {
            this.onSubmit();
        }
    }

    onSubmit() {
        this.submitAnswer();
    }

    onNext() {
        this.getQuestion();
    }

    submitAnswer() {
        if (this.answer !== '') {
            this.testService.postAnswer(this.question.id, this.answer).subscribe(answer => {
                this.testService.setCurrentTest(answer.test);
                if (answer.valid) {
                    this.valid = 'juist';
                    setTimeout(_ => this.getQuestion(), 500);
                } else {
                    this.valid = 'fout';
                }
            });
        } else {
            Promise.reject(null);
        }
    }

}
