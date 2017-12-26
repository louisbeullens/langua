import {Component, OnInit} from '@angular/core';
import {MemberService} from "../member.service";

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
        this.memberService.getResults().then(results => this.results = results);
    }

    onResetResults() {
        this.memberService.resetResults().subscribe(result => {
            this.results = null;
        });
    }

}
