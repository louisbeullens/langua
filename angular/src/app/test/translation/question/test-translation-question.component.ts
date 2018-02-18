import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TestService} from '../../../test.service';
import {Router} from "@angular/router";
import { AfterViewChecked } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
    selector: 'app-test-translation-question',
    templateUrl: './test-translation-question.component.html',
    styleUrls: ['./test-translation-question.component.css']
})
export class TestTranslationQuestionComponent implements OnInit, AfterViewChecked {
    public question;
    public answer = '';
    public valid = '';
    public correction = '';
    public order = 1;

    public specialChars: string[];

    @ViewChild('answerCtrl') answerEl:ElementRef;

    constructor(public testService: TestService, private router: Router) {
        this.specialChars = ['à', 'â', 'ç', 'é', 'ê', 'è', 'î', 'ô', 'œ', 'ù'];
    }

    ngOnInit() {
        this.getQuestion();
    }

    ngAfterViewChecked() {
        if (this.answerEl) {
            this.answerEl.nativeElement.focus();
        }
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
            });
        } else {
            this.router.navigateByUrl('/test/results');
        }
    }

    onKeyDown(event) {
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

    onNextKeydown(event) {
        if ((event.which === 13 || event.keyCode === 13) && this.answer !== '') {
            this.onNext();
        }
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
