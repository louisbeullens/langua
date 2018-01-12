import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TestService} from '../../../test.service';
import {Router} from "@angular/router";

@Component({
    selector: 'app-test-translation-question',
    templateUrl: './test-translation-question.component.html',
    styleUrls: ['./test-translation-question.component.css']
})
export class TestTranslationQuestionComponent implements OnInit {
    public question;
    public answer = '';
    public valid = '';
    public correction = '';
    public order = 1;

    public specialChars: string[];

    constructor(public testService: TestService, private router: Router) {
        this.specialChars = ['é','§','è','ç','à'];
    }

    ngOnInit() {
        this.getQuestion();
    }

    getQuestion() {
        this.answer = '';
        this.valid = '';
        if (this.testService.test.lastQuestion < this.testService.test.numQuestions) {
            this.testService.getQuestion().subscribe(question => {
                this.order = question.test.lastQuestion + 1;
                if (question.form === 'S') {
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
            }, err => {
                console.log(err);
            });
        } else {
            this.router.navigateByUrl('/test/results');
        }
    }

    onKeyDown(event) {
        console.log('onkeydown');
        if ((event.which === 13 || event.keyCode === 13) && this.answer !== '') {
            this.onSubmit();
        }
    }

    insertChar(answerCtrl, char) {
        answerCtrl.value += char;
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
                if (answer.valid) {
                    this.valid = 'juist';
                    setTimeout(_ => this.getQuestion(), 500);
                } else {
                    this.valid = 'fout';
                }
            });
        }
    }
}
