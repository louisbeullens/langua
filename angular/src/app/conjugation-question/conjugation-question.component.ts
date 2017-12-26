import {Component, OnInit} from '@angular/core';
import {TestService} from "../test.service";

@Component({
    selector: 'app-conjugation-question',
    templateUrl: './conjugation-question.component.html',
    styleUrls: ['./conjugation-question.component.css']
})
export class ConjugationQuestionComponent implements OnInit {
    public question;
    public valid = '';
    public answer = '';
    public correction = '';

    constructor(public testService: TestService) {
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
        console.log('onkeydown');
        if ((event.which === 13 || event.keyCode === 13) && this.answer !== '') {
            this.onSubmit();
        }
    }

    getQuestion() {
        this.testService.getQuestion().subscribe(question => {
            console.log(question);
            this.question = question;
            this.answer = '';
            this.valid = '';
            this.correction = question.prefix + ' ' + question.conjugation['form' + question.form];
        });
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
