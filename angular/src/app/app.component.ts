import {Component} from '@angular/core';
import {TestService} from "./test.service";
import {Observable} from "rxjs/Observable";
import {ApiService} from "./api.service";
import {MemberService} from "./member.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'Langua';
    languages: any = [
        {name:'Spaans', id:1},
        {name:'Engels', id:2},
        {name:'Nederlands', id:4},
        {name:'Frans', id:5}
    ];

    constructor(public memberService: MemberService, public testService: TestService) {
    }
}
