import {Component, OnInit} from '@angular/core';
import {TestService} from '../../../test.service';
import {Router} from "@angular/router";

@Component({
    selector: 'app-test-conjugation-question',
    templateUrl: './test-conjugation-question.component.html',
    styleUrls: ['./test-conjugation-question.component.css']
})
export class TestConjugationQuestionComponent implements OnInit {
    public question;
    public valid = '';
    public answer = '';
    public correction = '';
    public order = 1;

    constructor(public testService: TestService, private router: Router) {
    }

    ngOnInit() {
        this.getQuestion();
    }

    onSubmit() {
        this.submitAnswer();
    }

    onNext() {
        this.getQuestion();
    }

    onKeyDown(event) {
        if ((event.which === 13 || event.keyCode === 13) && this.answer !== '') {
            this.onSubmit();
        }
    }

    getQuestion() {
        if (this.testService.test.lastQuestion < this.testService.test.numQuestions) {
            this.testService.getQuestion().subscribe(question => {
                this.order = this.testService.test.lastQuestion + 1;
                this.question = question;
                this.answer = '';
                this.valid = '';
                this.correction = question.prefix + ' ' + question.conjugation['form' + question.form];
            });
        } else {
            this.router.navigateByUrl('/test/results');
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
        } else {
            Promise.reject(null);
        }
    }

}
