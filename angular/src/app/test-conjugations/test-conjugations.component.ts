import {Component, OnInit} from '@angular/core';
import {TestService} from "../test.service";

@Component({
    selector: 'app-test-conjugations',
    templateUrl: './test-conjugations.component.html',
    styleUrls: ['./test-conjugations.component.css']
})
export class TestConjugationsComponent implements OnInit {

    constructor(public testService: TestService) {
    }

    ngOnInit() {
    }
}
