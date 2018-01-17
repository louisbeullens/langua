import {Component} from '@angular/core';
import {TestService} from "./test.service";
import {MemberService} from "./member.service";
import { SearchService } from './search.service';
import { Router } from '@angular/router';

declare var window: any;
declare var screen: any;
declare var FB: any;

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

    public currentLanguage = 'Engels';
    public searchValue = '';

    constructor(public searchService: SearchService, private router: Router , public memberService: MemberService, public testService: TestService) {
    }

    search(event) {
        this.searchService.changeSearchValue(this.searchValue);
        this.router.navigateByUrl('/dictionary');
    }

    onDonate() {
        const left = (screen.width - 800) / 2;
        const top = (screen.height - 600) / 2;
        const paypal = window.open("https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=YLAADHGWPMBJS","donate","menubar=no,titlebar=no,status=no,left="+ left.toString() +",top="+ top +",width=800,height=600");
        if (paypal) {
            paypal.focus();
        }
    }

    onLanguageChange(languageId, language) {
        this.currentLanguage = language;
        this.memberService.changeCurrentLanguageId(languageId);
    }
}