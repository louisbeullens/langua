import {Component, OnInit} from '@angular/core';
import {MemberService} from '../../member.service';
import {Observable} from "rxjs/Observable";

@Component({
    selector: 'app-test-results',
    templateUrl: './test-results.component.html',
    styleUrls: ['./test-results.component.css']
})
export class TestResultsComponent implements OnInit {
    public results: any = null;

    constructor(private memberService: MemberService) {
    }

    ngOnInit() {
        this.memberService.getResults().then(results => this.results = results).catch(err => console.log('getResults err', err));
    }

    onResetResults() {
        this.memberService.resetResults().subscribe(result => {
            this.results = null;
        });
    }

}
